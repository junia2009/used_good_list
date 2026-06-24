# Totte — データ設計 / Firestore 構造 v0.1

Firebase（Firestore + Cloud Storage）前提のデータ設計。

## 1. コレクション構成

```
users/{uid}
  displayName : string
  email       : string
  photoURL    : string
  createdAt   : timestamp

groups/{groupId}
  name        : string
  ownerId     : string (uid)
  createdAt   : timestamp

  members/{uid}                      # サブコレクション：所属メンバー
    role        : "owner" | "member"
    displayName : string             # 一覧表示用に非正規化
    photoURL    : string
    inviteCode  : string             # 参加時に使った招待コード（ルール検証用）
    joinedAt    : timestamp

  items/{itemId}                     # サブコレクション：商品（いつものやつ）
    name       : string   (必須)     # 商品名
    brand      : string   (必須)     # メーカー/ブランド
    category   : string   (任意)     # 洗剤 / 食品 / 日用品 ...
    store      : string   (任意)     # 購入場所
    size       : string   (任意)     # 容量・規格
    note       : string   (任意)     # メモ
    jan        : string   (任意)     # バーコード（将来の照合用に枠だけ確保）
    photos     : array                # [{ path, url, isPrimary }]
    inStock    : boolean  (任意)      # 在庫フラグ
    createdBy  : string (uid)
    createdAt  : timestamp
    updatedAt  : timestamp

  shoppingLists/{listId}             # サブコレクション：お使いリスト
    title      : string
    status     : "active" | "done"
    assigneeId : string (uid) | null # 頼んだ相手
    items      : array                # ShoppingListItem の配列（下記）
    createdBy  : string (uid)
    createdAt  : timestamp

invites/{inviteCode}                 # トップレベル：招待コード
  groupId   : string
  createdBy : string (uid)
  expiresAt : timestamp
  createdAt : timestamp
```

### ShoppingListItem（`shoppingLists.items` 配列の各要素）

```
{
  id            : string,   # 配列内の一意ID
  itemId        : string,   # items/{itemId} への参照
  nameCache     : string,   # 商品名のスナップショット（商品削除/変更に強く、オフライン表示用）
  brandCache    : string,
  photoCache    : string,   # 代表写真URLのスナップショット
  quantity      : number,
  note          : string,
  checked       : boolean
}
```

> お使いリスト項目は商品の `name/brand/代表写真` を **キャッシュ** する。
> これにより元商品が編集・削除されてもリストの表示が壊れず、店頭オフラインでも見られる。

## 2. 設計判断のポイント

- **商品・お使いリストはグループのサブコレクション**にする。
  グループ単位でアクセス制御でき、セキュリティルールがシンプルになる。
- **メンバーはサブコレクション**（配列ではなく）にする。
  - 招待による参加を「メンバー文書の作成」としてルールで安全に許可できる。
  - ユーザーの所属グループ一覧は `members` への **コレクショングループクエリ**
    （`where uid 相当の文書を across groups で検索`）で取得する。
- **お使いリスト項目は配列**でリスト文書に内包。
  項目数は多くなく、リスト単位で読み書きするため1文書にまとめる方が効率的。

## 3. 招待・参加フロー（Cloud Functions なし）

1. メンバーが招待を作成 → `invites/{inviteCode}` を生成（`groupId` と有効期限を保存）。
2. 招待リンク（例: `https://totte.app/join?code=XXXX`）を共有。
3. 招待された人がリンクを開きログイン → クライアントが `invites/{code}` を読み取り `groupId` を取得。
4. クライアントが `groups/{groupId}/members/{uid}` を作成（`inviteCode` を含める）。
5. セキュリティルールが「本人 uid であること」かつ「その招待コードが実在し groupId が一致」を検証して許可。

> Cloud Functions を使わずクライアントのみで安全に参加処理を完結できる設計。

## 4. Cloud Storage 構造

```
groups/{groupId}/items/{itemId}/{photoId}.jpg
```

- アップロード時にクライアント側で圧縮・リサイズ（長辺 ~1280px 目安）。
- `photos[].path` に Storage パス、`photos[].url` にダウンロードURLを保存。

## 5. セキュリティルール（Firestore）方針

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{db}/documents {

    function isSignedIn() { return request.auth != null; }

    function isMember(groupId) {
      return isSignedIn()
        && exists(/databases/$(db)/documents/groups/$(groupId)/members/$(request.auth.uid));
    }

    // 自分のユーザー文書のみ読み書き可
    match /users/{uid} {
      allow read, write: if isSignedIn() && request.auth.uid == uid;
    }

    // 招待コード：ログイン済みなら読める（コードを知っている前提）。作成はメンバーのみ
    match /invites/{code} {
      allow read: if isSignedIn();
      allow create: if isMember(request.resource.data.groupId);
    }

    match /groups/{groupId} {
      allow read: if isMember(groupId);
      allow create: if isSignedIn() && request.resource.data.ownerId == request.auth.uid;
      allow update, delete: if isMember(groupId); // owner限定にするかは要検討

      // メンバー：本人＋有効な招待コードがあれば参加できる
      match /members/{uid} {
        allow read: if isMember(groupId);
        allow create: if isSignedIn()
          && request.auth.uid == uid
          && exists(/databases/$(db)/documents/invites/$(request.resource.data.inviteCode))
          && get(/databases/$(db)/documents/invites/$(request.resource.data.inviteCode)).data.groupId == groupId;
        allow delete: if isSignedIn() && request.auth.uid == uid; // 自分で退会
      }

      // 商品・お使いリスト：グループメンバーのみ
      match /items/{itemId} {
        allow read, write: if isMember(groupId);
      }
      match /shoppingLists/{listId} {
        allow read, write: if isMember(groupId);
      }
    }
  }
}
```

> グループ作成直後にオーナー自身の members 文書を作る必要がある。
> オーナーは `members/{自分}` を例外的に作成できるルールを別途追加する（招待コード不要）。

## 6. 必要なインデックス

- `members` の **コレクショングループ**インデックス（ユーザーの所属グループ一覧取得用）。
- `items`：`category` 絞り込み＋`createdAt` 並び替えの複合インデックス（必要に応じて）。

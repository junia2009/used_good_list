# Totte

> いつものやつを、みんなで共有。

普段使っている商品のパッケージ写真を家族・グループで共有し、お使いのときに
「いつものやつ」を正確に買ってきてもらうための Web/PWA アプリ。

おおむね同じだが別メーカー・別仕様の商品を買ってきてしまうトラブルを、
パッケージ写真とメーカー情報の共有で防ぎます。

## ドキュメント

- [仕様書](docs/spec.md) — 背景・機能要件・画面一覧・技術構成
- [データ設計](docs/data-model.md) — Firestore 構造・セキュリティルール・招待フロー
- [ワイヤーフレーム](docs/wireframes.md) — 各画面のラフと遷移

## 技術構成

- フロント: React + Vite + TypeScript（PWA）
- 認証: Firebase Authentication（Google ログイン）
- DB: Cloud Firestore
- 画像: Cloud Storage for Firebase
- ホスティング: Firebase Hosting

## 主な機能（MVP）

- 商品の登録・一覧・詳細（パッケージ写真＋メーカー等のメタ情報）
- グループ共有（家族など複数人で同じリストを閲覧・編集）
- お使いリスト（登録済み商品から選んで作成・店頭でチェック）

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. Firebase の準備

1. [Firebase コンソール](https://console.firebase.google.com/) でプロジェクトを作成。
2. Authentication で **Google** ログインを有効化。
3. **Cloud Firestore** と **Cloud Storage** を有効化。
4. ウェブアプリを追加し、設定値を取得。
5. `.env.example` を `.env` にコピーし、設定値を記入。

```bash
cp .env.example .env
# .env を編集して VITE_FIREBASE_* を埋める
```

### 3. 開発サーバー起動

```bash
npm run dev
```

### 4. セキュリティルール / ホスティングのデプロイ

```bash
npm run build
firebase deploy   # firestore.rules / storage.rules / hosting
```

## スクリプト

| コマンド | 内容 |
|---|---|
| `npm run dev` | 開発サーバー起動 |
| `npm run build` | 型チェック＋本番ビルド |
| `npm run preview` | ビルド結果のプレビュー |
| `npm run lint` | 型チェックのみ |

## ディレクトリ構成

```
src/
  contexts/    認証・グループの React Context
  services/    Firestore / Storage へのアクセス層
  components/  Layout・ProtectedRoute など共通UI
  pages/       各画面（一覧・詳細・登録・お使い・設定）
  firebase.ts  Firebase 初期化
  types.ts     ドメイン型定義
firestore.rules / storage.rules   セキュリティルール
```

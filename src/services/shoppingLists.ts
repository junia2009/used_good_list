import {
  addDoc,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getDocsFromServer,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../firebase';
import type { Item, ShoppingList, ShoppingListItem } from '../types';

function listsCol(groupId: string) {
  return collection(db, 'groups', groupId, 'shoppingLists');
}

export async function listShoppingLists(
  groupId: string,
  source: 'default' | 'server' = 'default',
): Promise<ShoppingList[]> {
  const q = query(listsCol(groupId), orderBy('createdAt', 'desc'));
  const snap = source === 'server' ? await getDocsFromServer(q) : await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<ShoppingList, 'id'>) }));
}

/** お使いリスト一覧をリアルタイム購読。解除関数を返す。 */
export function watchShoppingLists(
  groupId: string,
  onData: (lists: ShoppingList[]) => void,
  onError?: (e: Error) => void,
): () => void {
  return onSnapshot(
    query(listsCol(groupId), orderBy('createdAt', 'desc')),
    (snap) =>
      onData(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<ShoppingList, 'id'>) }))),
    (err) => onError?.(err),
  );
}

export async function getShoppingList(
  groupId: string,
  listId: string,
): Promise<ShoppingList | null> {
  const snap = await getDoc(doc(db, 'groups', groupId, 'shoppingLists', listId));
  return snap.exists() ? { id: snap.id, ...(snap.data() as Omit<ShoppingList, 'id'>) } : null;
}

/** 1つのお使いリストをリアルタイム購読（店頭でのチェックを家族間で即共有）。 */
export function watchShoppingList(
  groupId: string,
  listId: string,
  onData: (list: ShoppingList | null) => void,
  onError?: (e: Error) => void,
): () => void {
  return onSnapshot(
    doc(db, 'groups', groupId, 'shoppingLists', listId),
    (snap) =>
      onData(snap.exists() ? { id: snap.id, ...(snap.data() as Omit<ShoppingList, 'id'>) } : null),
    (err) => onError?.(err),
  );
}

export async function createShoppingList(
  groupId: string,
  createdBy: string,
  title: string,
): Promise<string> {
  const ref = await addDoc(listsCol(groupId), {
    title,
    status: 'active',
    assigneeId: null,
    items: [],
    createdBy,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

/** 指定したお使いリストへ商品を原子的に1件追記（配列まるごと上書きしない）。 */
export async function addItemToList(
  groupId: string,
  listId: string,
  listItem: ShoppingListItem,
): Promise<void> {
  await updateDoc(doc(db, 'groups', groupId, 'shoppingLists', listId), {
    items: arrayUnion(listItem),
  });
}

/**
 * 商品を「現在アクティブなお使いリスト」に追加する。
 * 端末間で取りこぼし・二重作成が起きないよう次の2点を担保する：
 * - アクティブなリストの有無はサーバ最新で判定（古いキャッシュでの誤判定＝
 *   二重作成を防ぐ。取得失敗時のみキャッシュにフォールバック）
 * - 既存リストへの追加は arrayUnion で「その1件だけ」を原子的に追記
 *   （配列まるごと上書きしないので、他端末が同時に足した項目を消さない）
 * 追加先（既存 or 新規作成）のリスト ID を返す。
 */
export async function addItemToActiveList(
  groupId: string,
  createdBy: string,
  listItem: ShoppingListItem,
): Promise<string> {
  let lists: ShoppingList[];
  try {
    lists = await listShoppingLists(groupId, 'server');
  } catch {
    lists = await listShoppingLists(groupId); // オフライン等はキャッシュで代替
  }
  const target = lists.find((l) => l.status === 'active');
  if (target) {
    await updateDoc(doc(db, 'groups', groupId, 'shoppingLists', target.id), {
      items: arrayUnion(listItem),
    });
    return target.id;
  }
  // アクティブなリストが無ければ、最初の1件を含めて新規作成
  const ref = await addDoc(listsCol(groupId), {
    title: '買い物リスト',
    status: 'active',
    assigneeId: null,
    items: [listItem],
    createdBy,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

/** 商品からお使いリスト項目を作る（表示情報をキャッシュ） */
export function toShoppingListItem(item: Item, quantity = 1, note = ''): ShoppingListItem {
  const primary = item.photos.find((p) => p.isPrimary) ?? item.photos[0];
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    itemId: item.id,
    nameCache: item.name,
    brandCache: item.brand,
    photoCache: primary?.url ?? '',
    quantity,
    note,
    checked: false,
  };
}

export async function updateShoppingList(
  groupId: string,
  listId: string,
  patch: Partial<ShoppingList>,
): Promise<void> {
  await updateDoc(doc(db, 'groups', groupId, 'shoppingLists', listId), patch);
}

export async function deleteShoppingList(groupId: string, listId: string): Promise<void> {
  await deleteDoc(doc(db, 'groups', groupId, 'shoppingLists', listId));
}

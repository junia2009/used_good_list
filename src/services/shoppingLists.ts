import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
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

export async function listShoppingLists(groupId: string): Promise<ShoppingList[]> {
  const snap = await getDocs(query(listsCol(groupId), orderBy('createdAt', 'desc')));
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

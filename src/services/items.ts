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
import type { Item, Photo } from '../types';

function itemsCol(groupId: string) {
  return collection(db, 'groups', groupId, 'items');
}

export async function listItems(groupId: string): Promise<Item[]> {
  const snap = await getDocs(query(itemsCol(groupId), orderBy('createdAt', 'desc')));
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Item, 'id'>) }));
}

/** 商品一覧をリアルタイム購読（キャッシュ即時→サーバ同期）。解除関数を返す。 */
export function watchItems(
  groupId: string,
  onData: (items: Item[]) => void,
  onError?: (e: Error) => void,
): () => void {
  return onSnapshot(
    query(itemsCol(groupId), orderBy('createdAt', 'desc')),
    (snap) => onData(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Item, 'id'>) }))),
    (err) => onError?.(err),
  );
}

export async function getItem(groupId: string, itemId: string): Promise<Item | null> {
  const snap = await getDoc(doc(db, 'groups', groupId, 'items', itemId));
  return snap.exists() ? { id: snap.id, ...(snap.data() as Omit<Item, 'id'>) } : null;
}

export type ItemInput = Omit<Item, 'id' | 'photos' | 'createdBy' | 'createdAt' | 'updatedAt'>;

/** 写真なしで先に商品を作成（ID を得てから写真をアップロードするため） */
export async function createItem(
  groupId: string,
  createdBy: string,
  input: ItemInput,
): Promise<string> {
  const ref = await addDoc(itemsCol(groupId), {
    ...input,
    photos: [],
    inStock: true,
    createdBy,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function setItemPhotos(
  groupId: string,
  itemId: string,
  photos: Photo[],
): Promise<void> {
  await updateDoc(doc(db, 'groups', groupId, 'items', itemId), {
    photos,
    updatedAt: serverTimestamp(),
  });
}

export async function updateItem(
  groupId: string,
  itemId: string,
  patch: Partial<Item>,
): Promise<void> {
  await updateDoc(doc(db, 'groups', groupId, 'items', itemId), {
    ...patch,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteItem(groupId: string, itemId: string): Promise<void> {
  await deleteDoc(doc(db, 'groups', groupId, 'items', itemId));
}

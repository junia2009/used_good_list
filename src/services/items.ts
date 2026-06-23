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
  writeBatch,
} from 'firebase/firestore';
import { db } from '../firebase';
import type { Item, Photo } from '../types';

function itemsCol(groupId: string) {
  return collection(db, 'groups', groupId, 'items');
}

/** 並び替え用のソートキー。手動 order があれば優先、無ければ新しい順（負の作成時刻） */
export function itemOrderValue(item: Item): number {
  if (typeof item.order === 'number') return item.order;
  return -(item.createdAt?.toMillis?.() ?? 0);
}

/** 商品を並び順で昇順ソートした新しい配列を返す */
export function sortItemsByOrder(items: Item[]): Item[] {
  return [...items].sort((a, b) => itemOrderValue(a) - itemOrderValue(b));
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

/**
 * 単一商品をリアルタイム購読（キャッシュ即時→サーバ同期）。解除関数を返す。
 * 一発 getDoc と違い再接続中でも固まらず、第2引数の onData が必ず呼ばれる
 * （存在しなければ null）。在庫切替などの更新も即座に反映される。
 */
export function watchItem(
  groupId: string,
  itemId: string,
  onData: (item: Item | null) => void,
  onError?: (e: Error) => void,
): () => void {
  return onSnapshot(
    doc(db, 'groups', groupId, 'items', itemId),
    (snap) => onData(snap.exists() ? { id: snap.id, ...(snap.data() as Omit<Item, 'id'>) } : null),
    (err) => onError?.(err),
  );
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
    // 新規は先頭（最小値）に来るよう負の作成時刻を初期 order とする
    order: -Date.now(),
    createdBy,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

/** 並び替え結果を保存。渡された ID 順に order を 0,1,2… で振り直す */
export async function reorderItems(groupId: string, orderedIds: string[]): Promise<void> {
  const batch = writeBatch(db);
  orderedIds.forEach((id, index) => {
    batch.update(doc(db, 'groups', groupId, 'items', id), { order: index });
  });
  await batch.commit();
}

/** 旧カテゴリ → 新3分類（食料品/日用品/その他）への対応表 */
const CATEGORY_MIGRATION: Record<string, string> = {
  食品: '食料品',
  調味料: '食料品',
  飲料: '食料品',
  洗剤: '日用品',
};

/**
 * 旧カテゴリの商品を新3分類へ一括付け替え（冪等：対象が無ければ何もしない）。
 * 渡された items のうち旧カテゴリのものだけを writeBatch でまとめて更新する。
 */
export async function migrateItemCategories(groupId: string, items: Item[]): Promise<void> {
  const targets = items.filter((i) => i.category && CATEGORY_MIGRATION[i.category]);
  if (targets.length === 0) return;
  const batch = writeBatch(db);
  for (const it of targets) {
    batch.update(doc(db, 'groups', groupId, 'items', it.id), {
      category: CATEGORY_MIGRATION[it.category as string],
    });
  }
  await batch.commit();
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

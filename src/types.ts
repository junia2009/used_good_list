import type { Timestamp } from 'firebase/firestore';

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  createdAt?: Timestamp;
}

export type MemberRole = 'owner' | 'member';

export interface Member {
  uid: string;
  role: MemberRole;
  displayName: string;
  photoURL: string;
  inviteCode?: string;
  joinedAt?: Timestamp;
}

export interface Group {
  id: string;
  name: string;
  ownerId: string;
  createdAt?: Timestamp;
}

export interface Photo {
  path: string;
  url: string;
  isPrimary: boolean;
}

export interface Item {
  id: string;
  name: string;
  brand: string;
  category?: string;
  store?: string;
  size?: string;
  note?: string;
  /** 商品の参考URL（メーカー公式・購入ページなど）。メモとは別管理 */
  url?: string;
  jan?: string;
  photos: Photo[];
  inStock?: boolean;
  order?: number;
  /** 写真が無い商品で表示する内蔵イラストの識別子（定番商品など） */
  icon?: string;
  createdBy: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface ShoppingListItem {
  id: string;
  itemId: string;
  nameCache: string;
  brandCache: string;
  photoCache: string;
  iconCache?: string;
  quantity: number;
  note: string;
  checked: boolean;
}

export type ShoppingListStatus = 'active' | 'done';

export interface ShoppingList {
  id: string;
  title: string;
  status: ShoppingListStatus;
  assigneeId: string | null;
  items: ShoppingListItem[];
  createdBy: string;
  createdAt?: Timestamp;
}

export interface Invite {
  code: string;
  groupId: string;
  createdBy: string;
  expiresAt: Timestamp;
  createdAt?: Timestamp;
}

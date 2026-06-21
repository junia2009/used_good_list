import {
  addDoc,
  collection,
  collectionGroup,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  where,
} from 'firebase/firestore';
import { db } from '../firebase';
import type { Group, Invite, Member } from '../types';
import type { User } from 'firebase/auth';

/** ログインユーザーが所属するグループ一覧を取得（members のコレクショングループクエリ） */
export async function getMyGroups(uid: string): Promise<Group[]> {
  const snap = await getDocs(query(collectionGroup(db, 'members'), where('uid', '==', uid)));
  const groups: Group[] = [];
  for (const m of snap.docs) {
    const groupRef = m.ref.parent.parent; // groups/{groupId}
    if (!groupRef) continue;
    const g = await getDoc(groupRef);
    if (g.exists()) groups.push({ id: g.id, ...(g.data() as Omit<Group, 'id'>) });
  }
  return groups;
}

/** グループを作成し、オーナー自身を members に登録 */
export async function createGroup(user: User, name: string): Promise<string> {
  const groupRef = await addDoc(collection(db, 'groups'), {
    name,
    ownerId: user.uid,
    createdAt: serverTimestamp(),
  });
  await setDoc(doc(db, 'groups', groupRef.id, 'members', user.uid), {
    uid: user.uid,
    role: 'owner',
    displayName: user.displayName ?? '',
    photoURL: user.photoURL ?? '',
    joinedAt: serverTimestamp(),
  });
  return groupRef.id;
}

export async function getMembers(groupId: string): Promise<Member[]> {
  const snap = await getDocs(collection(db, 'groups', groupId, 'members'));
  return snap.docs.map((d) => d.data() as Member);
}

/** 招待コードを作成（7日間有効） */
export async function createInvite(groupId: string, uid: string): Promise<string> {
  const code = Math.random().toString(36).slice(2, 8).toUpperCase();
  const expires = Timestamp.fromMillis(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await setDoc(doc(db, 'invites', code), {
    code,
    groupId,
    createdBy: uid,
    expiresAt: expires,
    createdAt: serverTimestamp(),
  });
  return code;
}

export async function getInvite(code: string): Promise<Invite | null> {
  const snap = await getDoc(doc(db, 'invites', code));
  return snap.exists() ? (snap.data() as Invite) : null;
}

/** 招待コードでグループに参加 */
export async function joinGroup(code: string, user: User): Promise<string> {
  const invite = await getInvite(code);
  if (!invite) throw new Error('招待コードが見つかりません');
  if (invite.expiresAt.toMillis() < Date.now()) throw new Error('招待コードの有効期限が切れています');
  await setDoc(doc(db, 'groups', invite.groupId, 'members', user.uid), {
    uid: user.uid,
    role: 'member',
    displayName: user.displayName ?? '',
    photoURL: user.photoURL ?? '',
    inviteCode: code,
    joinedAt: serverTimestamp(),
  });
  return invite.groupId;
}

export async function leaveGroup(groupId: string, uid: string): Promise<void> {
  await deleteDoc(doc(db, 'groups', groupId, 'members', uid));
}

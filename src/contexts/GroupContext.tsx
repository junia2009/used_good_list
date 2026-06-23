import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { getMyGroups, setSelectedGroup } from '../services/groups';
import { withTimeout } from '../services/realtime';
import type { Group } from '../types';

interface GroupContextValue {
  groups: Group[];
  currentGroup: Group | null;
  loading: boolean;
  error: string;
  selectGroup: (groupId: string) => void;
  refreshGroups: () => Promise<void>;
}

const GroupContext = createContext<GroupContextValue | undefined>(undefined);

const STORAGE_KEY = 'pacto.currentGroupId';

export function GroupProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [groups, setGroups] = useState<Group[]>([]);
  const [currentGroupId, setCurrentGroupId] = useState<string | null>(
    () => localStorage.getItem(STORAGE_KEY),
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function refreshGroups() {
    if (!user) {
      setGroups([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError('');

    // 1) まず端末キャッシュから即時復元。
    //    PWA を閉じて開き直したとき、サーバ応答待ちで「読み込み中」のまま
    //    固まるのを防ぐ（キャッシュがあればここで loading を解除する）。
    let hasData = false;
    try {
      const cached = await getMyGroups(user.uid, 'cache');
      setGroups(cached.groups);
      applySelection(cached.groups, cached.selectedGroupId);
      hasData = true;
      setLoading(false);
    } catch {
      // 初回などキャッシュ未保存。サーバ取得の結果を待つ
    }

    // 2) サーバから最新化（失敗・遅延してもキャッシュ表示は維持）。
    //    一発取得が再接続中に固まらないようタイムアウトを設ける。
    try {
      const fresh = await withTimeout(getMyGroups(user.uid, 'server'));
      setGroups(fresh.groups);
      applySelection(fresh.groups, fresh.selectedGroupId);
      setError('');
    } catch (e) {
      console.error('グループの取得に失敗', e);
      if (!hasData) setError(e instanceof Error ? e.message : 'グループの取得に失敗しました');
    } finally {
      setLoading(false);
    }
  }

  /**
   * 選択中グループを反映する。アカウントに保存された選択（全端末で共有）を
   * 最優先し、無ければ手元の選択、それも無ければグループが1つなら自動選択。
   * これにより端末ごとに別グループを開いてしまう取り違えを防ぐ。
   */
  function applySelection(list: Group[], remoteSelected: string | null) {
    const valid = (id: string | null) => !!id && list.some((g) => g.id === id);
    setCurrentGroupId((local) => {
      const next = valid(remoteSelected)
        ? remoteSelected
        : valid(local)
          ? local
          : list.length === 1
            ? list[0].id
            : local;
      if (next && next !== local) localStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  }

  useEffect(() => {
    refreshGroups();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  function selectGroup(groupId: string) {
    setCurrentGroupId(groupId);
    localStorage.setItem(STORAGE_KEY, groupId);
    // アカウントにも保存して他端末と選択を揃える（失敗しても手元の選択は有効）
    if (user) setSelectedGroup(user.uid, groupId).catch(() => undefined);
  }

  const currentGroup =
    groups.find((g) => g.id === currentGroupId) ?? (groups.length === 1 ? groups[0] : null);

  return (
    <GroupContext.Provider
      value={{ groups, currentGroup, loading, error, selectGroup, refreshGroups }}
    >
      {children}
    </GroupContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useGroup() {
  const ctx = useContext(GroupContext);
  if (!ctx) throw new Error('useGroup must be used within GroupProvider');
  return ctx;
}

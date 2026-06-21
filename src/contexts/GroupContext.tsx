import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { getMyGroups } from '../services/groups';
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
    try {
      const gs = await getMyGroups(user.uid);
      setGroups(gs);
    } catch (e) {
      console.error('グループの取得に失敗', e);
      setError(e instanceof Error ? e.message : 'グループの取得に失敗しました');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refreshGroups();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  function selectGroup(groupId: string) {
    setCurrentGroupId(groupId);
    localStorage.setItem(STORAGE_KEY, groupId);
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

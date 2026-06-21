import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useGroup } from '../contexts/GroupContext';
import { createGroup, joinGroup } from '../services/groups';

export default function Groups() {
  const { user } = useAuth();
  const { groups, loading, selectGroup, refreshGroups } = useGroup();
  const navigate = useNavigate();
  const [newName, setNewName] = useState('');
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  function open(groupId: string) {
    selectGroup(groupId);
    navigate('/items');
  }

  async function handleCreate() {
    if (!user || !newName.trim()) return;
    setBusy(true);
    setError('');
    try {
      const id = await createGroup(user, newName.trim());
      await refreshGroups();
      open(id);
    } catch {
      setError('グループの作成に失敗しました');
    } finally {
      setBusy(false);
    }
  }

  async function handleJoin() {
    if (!user || !code.trim()) return;
    setBusy(true);
    setError('');
    try {
      const id = await joinGroup(code.trim().toUpperCase(), user);
      await refreshGroups();
      open(id);
    } catch (e) {
      setError(e instanceof Error ? e.message : '参加に失敗しました');
    } finally {
      setBusy(false);
    }
  }

  if (loading) return <div className="centered">読み込み中…</div>;

  return (
    <div className="page">
      <h2>グループを選ぶ</h2>
      <ul className="group-list">
        {groups.map((g) => (
          <li key={g.id}>
            <button className="row-btn" onClick={() => open(g.id)}>
              🏠 {g.name}
              <span className="chevron">▶</span>
            </button>
          </li>
        ))}
        {groups.length === 0 && <p className="muted">まだグループがありません。</p>}
      </ul>

      <section className="card">
        <h3>新しいグループを作る</h3>
        <input
          placeholder="グループ名（例: わが家）"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <button className="btn-primary" disabled={busy} onClick={handleCreate}>
          作成
        </button>
      </section>

      <section className="card">
        <h3>招待コードで参加</h3>
        <input
          placeholder="招待コード"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <button className="btn-secondary" disabled={busy} onClick={handleJoin}>
          参加
        </button>
      </section>

      {error && <p className="error">{error}</p>}
    </div>
  );
}

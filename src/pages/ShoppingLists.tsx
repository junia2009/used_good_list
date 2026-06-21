import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useGroup } from '../contexts/GroupContext';
import { createShoppingList, watchShoppingLists } from '../services/shoppingLists';
import type { ShoppingList } from '../types';
import { IconPlus, IconCheck, IconCart } from '../components/icons';

export default function ShoppingLists() {
  const { user } = useAuth();
  const { currentGroup } = useGroup();
  const navigate = useNavigate();
  const [lists, setLists] = useState<ShoppingList[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!currentGroup) {
      navigate('/groups');
      return;
    }
    setLoading(true);
    setLoadError(false);
    const unsub = watchShoppingLists(
      currentGroup.id,
      (ls) => {
        setLists(ls);
        setLoading(false);
      },
      () => {
        setLoadError(true);
        setLoading(false);
      },
    );
    return unsub;
  }, [currentGroup, navigate, reloadKey]);

  async function handleCreate() {
    if (!user || !currentGroup) return;
    const title = `${new Date().toLocaleDateString('ja-JP')}の買い物`;
    const id = await createShoppingList(currentGroup.id, user.uid, title);
    navigate(`/lists/${id}`);
  }

  if (!currentGroup) return null;
  if (loading) return <div className="centered">読み込み中…</div>;
  if (loadError)
    return (
      <div className="page">
        <h2>お使いリスト</h2>
        <div className="empty">
          <IconCart />
          <p>読み込みに失敗しました。{'\n'}電波の良い場所でお試しください。</p>
          <button
            className="btn-secondary"
            style={{ maxWidth: 240, margin: '12px auto 0' }}
            onClick={() => setReloadKey((k) => k + 1)}
          >
            再読み込み
          </button>
        </div>
      </div>
    );

  const active = lists.filter((l) => l.status === 'active');
  const done = lists.filter((l) => l.status === 'done');

  function progress(l: ShoppingList) {
    const checked = l.items.filter((i) => i.checked).length;
    return `${checked}/${l.items.length}`;
  }

  return (
    <div className="page">
      <h2>お使いリスト</h2>
      <ul className="list">
        {active.map((l) => (
          <li key={l.id}>
            <Link to={`/lists/${l.id}`} className="row-btn">
              <span className="list-title">{l.title}</span>
              <span className="progress">{progress(l)}</span>
            </Link>
          </li>
        ))}
        {done.map((l) => (
          <li key={l.id}>
            <Link to={`/lists/${l.id}`} className="row-btn done">
              <span className="list-title">
                <IconCheck className="done-check" /> {l.title}
              </span>
              <span className="muted sm">完了</span>
            </Link>
          </li>
        ))}
        {lists.length === 0 && (
          <div className="empty">
            <IconCart />
            <p>お使いリストはまだありません。{'\n'}右下の＋から作成できます。</p>
          </div>
        )}
      </ul>
      <button className="fab" onClick={handleCreate} aria-label="リストを作成">
        <IconPlus />
      </button>
    </div>
  );
}

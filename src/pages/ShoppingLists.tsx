import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useGroup } from '../contexts/GroupContext';
import { createShoppingList, listShoppingLists } from '../services/shoppingLists';
import type { ShoppingList } from '../types';

export default function ShoppingLists() {
  const { user } = useAuth();
  const { currentGroup } = useGroup();
  const navigate = useNavigate();
  const [lists, setLists] = useState<ShoppingList[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentGroup) {
      navigate('/groups');
      return;
    }
    listShoppingLists(currentGroup.id)
      .then(setLists)
      .finally(() => setLoading(false));
  }, [currentGroup, navigate]);

  async function handleCreate() {
    if (!user || !currentGroup) return;
    const title = `${new Date().toLocaleDateString('ja-JP')}の買い物`;
    const id = await createShoppingList(currentGroup.id, user.uid, title);
    navigate(`/lists/${id}`);
  }

  if (!currentGroup) return null;
  if (loading) return <div className="centered">読み込み中…</div>;

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
              ● {l.title}
              <span className="progress">{progress(l)}</span>
            </Link>
          </li>
        ))}
        {done.map((l) => (
          <li key={l.id}>
            <Link to={`/lists/${l.id}`} className="row-btn done">
              ✓ {l.title}（完了）
            </Link>
          </li>
        ))}
        {lists.length === 0 && <p className="muted">お使いリストはまだありません。</p>}
      </ul>
      <button className="fab" onClick={handleCreate} aria-label="リストを作成">
        ＋
      </button>
    </div>
  );
}

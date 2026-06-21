import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGroup } from '../contexts/GroupContext';
import {
  deleteShoppingList,
  getShoppingList,
  updateShoppingList,
} from '../services/shoppingLists';
import type { ShoppingList } from '../types';

/** 写真サムネ。読み込めない場合は 📦 を表示 */
function Thumb({ url }: { url: string }) {
  const [failed, setFailed] = useState(false);
  if (!url || failed) return <span className="shop-photo">📦</span>;
  return (
    <span className="shop-photo">
      <img src={url} alt="" onError={() => setFailed(true)} />
    </span>
  );
}

export default function ShoppingListDetail() {
  const { listId } = useParams();
  const { currentGroup } = useGroup();
  const navigate = useNavigate();
  const [list, setList] = useState<ShoppingList | null>(null);

  useEffect(() => {
    if (currentGroup && listId) getShoppingList(currentGroup.id, listId).then(setList);
  }, [currentGroup, listId]);

  if (!list || !currentGroup) return <div className="centered">読み込み中…</div>;

  async function toggle(itemId: string) {
    if (!currentGroup || !list) return;
    const items = list.items.map((i) =>
      i.id === itemId ? { ...i, checked: !i.checked } : i,
    );
    setList({ ...list, items });
    await updateShoppingList(currentGroup.id, list.id, { items });
  }

  async function finishList() {
    if (!currentGroup || !list) return;
    const status = list.status === 'active' ? 'done' : 'active';
    await updateShoppingList(currentGroup.id, list.id, { status });
    setList({ ...list, status });
  }

  async function remove() {
    if (!currentGroup || !list) return;
    if (!confirm('このリストを削除しますか？')) return;
    await deleteShoppingList(currentGroup.id, list.id);
    navigate('/lists');
  }

  const checked = list.items.filter((i) => i.checked).length;

  return (
    <div className="page">
      <header className="form-header">
        <button className="link" onClick={() => navigate(-1)}>
          ◀ {list.title}
        </button>
        <span className="progress">
          {checked}/{list.items.length}
        </span>
      </header>

      <ul className="shop-items">
        {list.items.map((it) => (
          <li key={it.id} className={it.checked ? 'checked' : ''}>
            <label>
              <input type="checkbox" checked={it.checked} onChange={() => toggle(it.id)} />
              <Thumb url={it.photoCache} />
              <span className="shop-text">
                <strong className="shop-name">{it.nameCache || '(名称なし)'}</strong>
                <span className="shop-sub">
                  {it.brandCache}
                  {it.quantity ? ` ・ ${it.quantity}個` : ''}
                </span>
                {it.note && <em>メモ: {it.note}</em>}
              </span>
            </label>
          </li>
        ))}
        {list.items.length === 0 && (
          <p className="muted">商品詳細の「お使いに追加」から商品を追加できます。</p>
        )}
      </ul>

      <button className="btn-primary" onClick={finishList}>
        {list.status === 'active' ? '完了にする' : '再開する'}
      </button>
      <button className="btn-danger" onClick={remove}>
        削除
      </button>
    </div>
  );
}

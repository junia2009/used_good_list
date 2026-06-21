import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGroup } from '../contexts/GroupContext';
import { deleteItem, getItem, updateItem } from '../services/items';
import {
  createShoppingList,
  listShoppingLists,
  toShoppingListItem,
  updateShoppingList,
} from '../services/shoppingLists';
import { useAuth } from '../contexts/AuthContext';
import type { Item } from '../types';

export default function ItemDetail() {
  const { itemId } = useParams();
  const { user } = useAuth();
  const { currentGroup } = useGroup();
  const navigate = useNavigate();
  const [item, setItem] = useState<Item | null>(null);
  const [active, setActive] = useState(0);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (currentGroup && itemId) getItem(currentGroup.id, itemId).then(setItem);
  }, [currentGroup, itemId]);

  if (!item || !currentGroup) return <div className="centered">読み込み中…</div>;

  async function handleDelete() {
    if (!currentGroup || !item) return;
    if (!confirm('この商品を削除しますか？')) return;
    await deleteItem(currentGroup.id, item.id);
    navigate('/items');
  }

  async function toggleStock() {
    if (!currentGroup || !item) return;
    const next = !item.inStock;
    await updateItem(currentGroup.id, item.id, { inStock: next });
    setItem({ ...item, inStock: next });
  }

  /** 直近の active なお使いリストに追加。なければ新規作成 */
  async function addToShopping() {
    if (!user || !currentGroup || !item) return;
    const lists = await listShoppingLists(currentGroup.id);
    let target = lists.find((l) => l.status === 'active');
    if (!target) {
      const id = await createShoppingList(currentGroup.id, user.uid, '買い物リスト');
      target = { id, title: '買い物リスト', status: 'active', assigneeId: null, items: [], createdBy: user.uid };
    }
    const items = [...target.items, toShoppingListItem(item)];
    await updateShoppingList(currentGroup.id, target.id, { items });
    setMsg('お使いリストに追加しました');
  }

  const photo = item.photos[active];

  return (
    <div className="page">
      <header className="form-header">
        <button className="link" onClick={() => navigate(-1)}>
          ◀ 戻る
        </button>
        <button className="link" onClick={() => navigate(`/items/${item.id}/edit`)}>
          編集
        </button>
      </header>

      <div className="detail-photo">
        {photo ? <img src={photo.url} alt={item.name} /> : <span>📦</span>}
      </div>
      {item.photos.length > 1 && (
        <div className="dots">
          {item.photos.map((_, i) => (
            <button
              key={i}
              className={`dot ${i === active ? 'dot-active' : ''}`}
              onClick={() => setActive(i)}
            />
          ))}
        </div>
      )}

      <h2>{item.name}</h2>
      <dl className="meta">
        <dt>メーカー</dt>
        <dd>{item.brand}</dd>
        {item.category && (<><dt>カテゴリ</dt><dd>{item.category}</dd></>)}
        {item.size && (<><dt>容量</dt><dd>{item.size}</dd></>)}
        {item.store && (<><dt>購入場所</dt><dd>{item.store}</dd></>)}
        {item.note && (<><dt>メモ</dt><dd>{item.note}</dd></>)}
        <dt>在庫</dt>
        <dd>{item.inStock ? 'あり' : '切れ'}</dd>
      </dl>

      <button className="btn-primary" onClick={addToShopping}>
        🛒 お使いに追加
      </button>
      <button className="btn-secondary" onClick={toggleStock}>
        {item.inStock ? '在庫切れにする' : '在庫ありにする'}
      </button>
      <button className="btn-danger" onClick={handleDelete}>
        削除
      </button>
      {msg && <p className="success">{msg}</p>}
    </div>
  );
}

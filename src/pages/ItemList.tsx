import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGroup } from '../contexts/GroupContext';
import { listItems } from '../services/items';
import type { Item } from '../types';

export default function ItemList() {
  const { currentGroup } = useGroup();
  const navigate = useNavigate();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('すべて');

  useEffect(() => {
    if (!currentGroup) {
      navigate('/groups');
      return;
    }
    setLoading(true);
    listItems(currentGroup.id)
      .then(setItems)
      .finally(() => setLoading(false));
  }, [currentGroup, navigate]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    items.forEach((i) => i.category && set.add(i.category));
    return ['すべて', ...set];
  }, [items]);

  const filtered = items.filter((i) => {
    const matchCat = category === 'すべて' || i.category === category;
    const kw = keyword.trim().toLowerCase();
    const matchKw =
      !kw || i.name.toLowerCase().includes(kw) || i.brand.toLowerCase().includes(kw);
    return matchCat && matchKw;
  });

  if (!currentGroup) return null;

  return (
    <div className="page">
      <header className="list-header">
        <h2>{currentGroup.name}</h2>
        <input
          className="search"
          placeholder="🔍 商品名・メーカーで検索"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <div className="chips">
          {categories.map((c) => (
            <button
              key={c}
              className={`chip ${c === category ? 'chip-active' : ''}`}
              onClick={() => setCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>
      </header>

      {loading ? (
        <div className="centered">読み込み中…</div>
      ) : filtered.length === 0 ? (
        <p className="muted">商品がありません。右下の＋から追加しましょう。</p>
      ) : (
        <div className="item-grid">
          {filtered.map((item) => {
            const photo = item.photos.find((p) => p.isPrimary) ?? item.photos[0];
            return (
              <Link key={item.id} to={`/items/${item.id}`} className="item-card">
                <div className="item-photo">
                  {photo ? <img src={photo.url} alt={item.name} /> : <span>📦</span>}
                </div>
                <div className="item-name">{item.name}</div>
                <div className="item-brand">{item.brand}</div>
              </Link>
            );
          })}
        </div>
      )}

      <button className="fab" onClick={() => navigate('/items/new')} aria-label="商品を追加">
        ＋
      </button>
    </div>
  );
}

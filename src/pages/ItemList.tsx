import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGroup } from '../contexts/GroupContext';
import { listItems } from '../services/items';
import type { Item } from '../types';
import { IconSearch, IconPlus, IconItems, IconChevron } from '../components/icons';

export default function ItemList() {
  const { currentGroup } = useGroup();
  const navigate = useNavigate();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('すべて');

  function load(groupId: string) {
    setLoading(true);
    setLoadError(false);
    listItems(groupId)
      .then(setItems)
      .catch(() => setLoadError(true))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    if (!currentGroup) {
      navigate('/groups');
      return;
    }
    load(currentGroup.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        <div className="title-row">
          <h2>{currentGroup.name}</h2>
          <Link to="/groups" className="icon-btn ghost" aria-label="グループ切替">
            <IconChevron />
          </Link>
        </div>
        <div className="search-field">
          <IconSearch />
          <input
            placeholder="商品名・メーカーで検索"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>
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
      ) : loadError ? (
        <div className="empty">
          <IconItems />
          <p>読み込みに失敗しました。{'\n'}電波の良い場所でお試しください。</p>
          <button
            className="btn-secondary"
            style={{ maxWidth: 240, margin: '12px auto 0' }}
            onClick={() => currentGroup && load(currentGroup.id)}
          >
            再読み込み
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty">
          <IconItems />
          <p>
            {items.length === 0
              ? '「いつものやつ」を登録しましょう。\n右下の＋から追加できます。'
              : '該当する商品がありません。'}
          </p>
        </div>
      ) : (
        <div className="item-grid">
          {filtered.map((item) => {
            const photo = item.photos.find((p) => p.isPrimary) ?? item.photos[0];
            return (
              <Link key={item.id} to={`/items/${item.id}`} className="item-card">
                <div className="item-photo">
                  {photo ? <img src={photo.url} alt={item.name} /> : <IconItems />}
                  {item.inStock === false && <span className="stock-dot">在庫切れ</span>}
                </div>
                <div className="item-body">
                  <div className="item-name">{item.name}</div>
                  <div className="item-brand">{item.brand}</div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      <button className="fab" onClick={() => navigate('/items/new')} aria-label="商品を追加">
        <IconPlus />
      </button>
    </div>
  );
}

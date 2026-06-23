import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGroup } from '../contexts/GroupContext';
import { deleteItem, updateItem, watchItem } from '../services/items';
import {
  createShoppingList,
  listShoppingLists,
  toShoppingListItem,
  updateShoppingList,
} from '../services/shoppingLists';
import { useAuth } from '../contexts/AuthContext';
import type { Item } from '../types';
import {
  IconBack,
  IconEdit,
  IconCart,
  IconTrash,
  IconClose,
  PhotoPlaceholder,
} from '../components/icons';

export default function ItemDetail() {
  const { itemId } = useParams();
  const { user } = useAuth();
  const { currentGroup } = useGroup();
  const navigate = useNavigate();
  const [item, setItem] = useState<Item | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [active, setActive] = useState(0);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [msg, setMsg] = useState('');
  const trackRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<HTMLDivElement>(null);

  // リアルタイム購読：キャッシュを即時に返すため再接続中でも固まらない
  useEffect(() => {
    if (!currentGroup || !itemId) return;
    setActive(0);
    setLoaded(false);
    return watchItem(
      currentGroup.id,
      itemId,
      (it) => {
        setItem(it);
        setLoaded(true);
      },
      // エラー時もスピナーは止める（固まらせない）
      () => setLoaded(true),
    );
  }, [currentGroup, itemId]);

  // 全画面表示中は背景スクロールを止め、Esc で閉じる
  useEffect(() => {
    if (!viewerOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setViewerOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [viewerOpen]);

  // 全画面を開いたら、現在表示中の写真までスクロールを合わせる
  useEffect(() => {
    if (viewerOpen && viewerRef.current) {
      viewerRef.current.scrollLeft = active * viewerRef.current.clientWidth;
    }
  }, [viewerOpen]);

  if (!currentGroup || !loaded) return <div className="centered">読み込み中…</div>;

  if (!item) {
    return (
      <div className="page">
        <header className="form-header">
          <button className="icon-btn ghost" onClick={() => navigate('/items')} aria-label="商品一覧へ戻る">
            <IconBack />
          </button>
        </header>
        <div className="empty">
          <PhotoPlaceholder />
          <p>この商品は見つかりませんでした。{'\n'}削除された可能性があります。</p>
        </div>
      </div>
    );
  }

  async function handleDelete() {
    if (!currentGroup || !item) return;
    if (!confirm('この商品を削除しますか？')) return;
    await deleteItem(currentGroup.id, item.id);
    navigate('/items');
  }

  async function toggleStock() {
    if (!currentGroup || !item) return;
    // 書き込むと購読側に即時反映される（保留書き込みも即時）
    await updateItem(currentGroup.id, item.id, { inStock: !item.inStock });
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

  /** スクロール位置から現在の写真インデックスを割り出して同期 */
  function syncActive(el: HTMLDivElement) {
    const i = Math.round(el.scrollLeft / el.clientWidth);
    setActive((prev) => (prev === i ? prev : i));
  }

  /** ドットをタップしたら該当写真へスムーススクロール */
  function goTo(i: number) {
    const el = trackRef.current;
    if (el) el.scrollTo({ left: i * el.clientWidth, behavior: 'smooth' });
  }

  return (
    <div className="page">
      <header className="form-header">
        <button className="icon-btn ghost" onClick={() => navigate('/items')} aria-label="商品一覧へ戻る">
          <IconBack />
        </button>
        <button
          className="icon-btn ghost"
          onClick={() => navigate(`/items/${item.id}/edit`)}
          aria-label="編集"
        >
          <IconEdit />
        </button>
      </header>

      {item.photos.length === 0 ? (
        <div className="detail-photo">
          <PhotoPlaceholder />
        </div>
      ) : (
        <>
          <div
            className="photo-carousel"
            ref={trackRef}
            onScroll={(e) => syncActive(e.currentTarget)}
          >
            {item.photos.map((p) => (
              <button
                type="button"
                className="photo-slide"
                key={p.path}
                onClick={() => setViewerOpen(true)}
                aria-label="写真を拡大"
              >
                <img src={p.url} alt={item.name} />
              </button>
            ))}
          </div>
          {item.photos.length > 1 && (
            <div className="dots">
              {item.photos.map((_, i) => (
                <button
                  key={i}
                  className={`dot ${i === active ? 'dot-active' : ''}`}
                  onClick={() => goTo(i)}
                  aria-label={`写真 ${i + 1}`}
                />
              ))}
            </div>
          )}
        </>
      )}

      <h2 className="detail-title">{item.name}</h2>
      <p className="detail-brand">{item.brand}</p>
      <dl className="meta">
        {item.category && (<><dt>カテゴリ</dt><dd>{item.category}</dd></>)}
        {item.size && (<><dt>容量・規格</dt><dd>{item.size}</dd></>)}
        {item.store && (<><dt>購入場所</dt><dd>{item.store}</dd></>)}
        {item.note && (<><dt>メモ</dt><dd>{item.note}</dd></>)}
        <dt>在庫</dt>
        <dd>{item.inStock === false ? '切れ' : 'あり'}</dd>
      </dl>

      <div className="detail-actions">
        <button className="btn-primary" onClick={addToShopping}>
          <IconCart /> お使いに追加
        </button>
        <button className="btn-secondary" onClick={toggleStock}>
          {item.inStock === false ? '在庫ありに戻す' : '在庫切れにする'}
        </button>
        <button className="btn-danger" onClick={handleDelete}>
          <IconTrash /> 削除
        </button>
        {msg && <p className="success">{msg}</p>}
      </div>

      {viewerOpen && (
        <div className="lightbox" role="dialog" aria-modal="true" onClick={() => setViewerOpen(false)}>
          <button className="lightbox-close" aria-label="閉じる" onClick={() => setViewerOpen(false)}>
            <IconClose />
          </button>
          {item.photos.length > 1 && (
            <span className="lightbox-count">
              {active + 1} / {item.photos.length}
            </span>
          )}
          <div
            className="lightbox-track"
            ref={viewerRef}
            onScroll={(e) => syncActive(e.currentTarget)}
          >
            {item.photos.map((p) => (
              <div className="lightbox-slide" key={p.path}>
                <img src={p.url} alt={item.name} onClick={(e) => e.stopPropagation()} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

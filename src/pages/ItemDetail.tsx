import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGroup } from '../contexts/GroupContext';
import { deleteItem, updateItem, watchItem } from '../services/items';
import { subscribeWithTimeout, withTimeout } from '../services/realtime';
import {
  addItemToActiveList,
  addItemToList,
  createShoppingList,
  listShoppingLists,
  toShoppingListItem,
} from '../services/shoppingLists';
import { useAuth } from '../contexts/AuthContext';
import type { Item, ShoppingList } from '../types';
import Sheet from '../components/Sheet';
import {
  IconBack,
  IconEdit,
  IconCart,
  IconTrash,
  IconClose,
  IconPlus,
  PhotoPlaceholder,
} from '../components/icons';

export default function ItemDetail() {
  const { itemId } = useParams();
  const { user } = useAuth();
  const { currentGroup } = useGroup();
  const navigate = useNavigate();
  const [item, setItem] = useState<Item | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [active, setActive] = useState(0);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [msg, setMsg] = useState('');
  const [msgIsError, setMsgIsError] = useState(false);
  const [qty, setQty] = useState(1);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerLists, setPickerLists] = useState<ShoppingList[]>([]);
  const trackRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<HTMLDivElement>(null);

  // リアルタイム購読：キャッシュを即時に返すため再接続中でも固まらない。
  // 初回データが届かない時はタイムアウトで再読み込み可能な状態にする。
  useEffect(() => {
    if (!currentGroup || !itemId) return;
    setActive(0);
    setLoaded(false);
    setLoadError(false);
    return subscribeWithTimeout<Item | null>(
      (onData, onError) => watchItem(currentGroup.id, itemId, onData, onError),
      (it) => {
        setItem(it);
        setLoaded(true);
        setLoadError(false);
      },
      () => {
        setLoadError(true);
        setLoaded(true);
      },
    );
  }, [currentGroup, itemId, reloadKey]);

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
          {loadError ? (
            <>
              <p>読み込みに失敗しました。{'\n'}電波の良い場所でお試しください。</p>
              <button
                className="btn-secondary"
                style={{ maxWidth: 240, margin: '12px auto 0' }}
                onClick={() => setReloadKey((k) => k + 1)}
              >
                再読み込み
              </button>
            </>
          ) : (
            <p>この商品は見つかりませんでした。{'\n'}削除された可能性があります。</p>
          )}
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

  function notifyAdded(label: string) {
    setMsgIsError(false);
    setMsg(`${label}（${qty}個）`);
    setQty(1);
  }

  function notifyError() {
    setMsgIsError(true);
    setMsg('追加に失敗しました。通信状況をご確認ください。');
  }

  /**
   * お使いに追加。リストが複数あるときは追加先を選ぶピッカーを開き、
   * 0〜1件のときはこれまでどおりアクティブなリスト（無ければ新規作成）へ。
   */
  async function addToShopping() {
    if (!user || !currentGroup || !item) return;
    let lists: ShoppingList[] = [];
    try {
      lists = await withTimeout(listShoppingLists(currentGroup.id, 'server'));
    } catch {
      try {
        lists = await listShoppingLists(currentGroup.id);
      } catch {
        lists = [];
      }
    }
    if (lists.length >= 2) {
      setPickerLists(lists);
      setPickerOpen(true);
      return;
    }
    try {
      await addItemToActiveList(currentGroup.id, user.uid, toShoppingListItem(item, qty));
      notifyAdded('お使いリストに追加しました');
    } catch {
      notifyError();
    }
  }

  /** ピッカーで選んだ既存リストへ追加。 */
  async function addToChosenList(listId: string) {
    if (!currentGroup || !item) return;
    try {
      await addItemToList(currentGroup.id, listId, toShoppingListItem(item, qty));
      notifyAdded('お使いリストに追加しました');
    } catch {
      notifyError();
    } finally {
      setPickerOpen(false);
    }
  }

  /** ピッカーから新規リストを作って追加。 */
  async function createListAndAdd() {
    if (!user || !currentGroup || !item) return;
    try {
      const title = `${new Date().toLocaleDateString('ja-JP')}の買い物`;
      const id = await createShoppingList(currentGroup.id, user.uid, title);
      await addItemToList(currentGroup.id, id, toShoppingListItem(item, qty));
      notifyAdded('新しいリストに追加しました');
    } catch {
      notifyError();
    } finally {
      setPickerOpen(false);
    }
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
        <div className="qty-row">
          <span>個数</span>
          <div className="qty-stepper">
            <button
              type="button"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              disabled={qty <= 1}
              aria-label="個数を減らす"
            >
              −
            </button>
            <span className="qty-value" aria-live="polite">{qty}</span>
            <button
              type="button"
              onClick={() => setQty((q) => Math.min(99, q + 1))}
              disabled={qty >= 99}
              aria-label="個数を増やす"
            >
              ＋
            </button>
          </div>
        </div>
        <button className="btn-primary" onClick={addToShopping}>
          <IconCart /> お使いに追加
        </button>
        <button className="btn-secondary" onClick={toggleStock}>
          {item.inStock === false ? '在庫ありに戻す' : '在庫切れにする'}
        </button>
        <button className="btn-danger" onClick={handleDelete}>
          <IconTrash /> 削除
        </button>
        {msg && <p className={msgIsError ? 'error' : 'success'}>{msg}</p>}
      </div>

      {pickerOpen && (
        <Sheet title="どのリストに追加しますか？" onClose={() => setPickerOpen(false)}>
          <ul className="picker-list">
            {pickerLists.map((l) => (
              <li key={l.id}>
                <button className="row-btn" onClick={() => addToChosenList(l.id)}>
                  <span className="list-title">{l.title}</span>
                  <span className="muted sm">
                    {l.status === 'done' ? '完了' : `${l.items.length}点`}
                  </span>
                </button>
              </li>
            ))}
            <li>
              <button className="row-btn" onClick={createListAndAdd}>
                <span className="list-title">
                  <IconPlus className="row-lead" /> 新しいリストを作成して追加
                </span>
              </button>
            </li>
          </ul>
        </Sheet>
      )}

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

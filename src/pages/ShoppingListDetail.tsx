import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGroup } from '../contexts/GroupContext';
import {
  addItemToList,
  deleteShoppingList,
  toShoppingListItem,
  updateShoppingList,
  watchShoppingList,
} from '../services/shoppingLists';
import { listItems } from '../services/items';
import { subscribeWithTimeout } from '../services/realtime';
import type { Item, ShoppingList } from '../types';
import Sheet from '../components/Sheet';
import {
  IconBack,
  IconCheck,
  IconTrash,
  IconCart,
  IconEdit,
  IconPlus,
  IconSearch,
  PhotoPlaceholder,
} from '../components/icons';

/** 写真サムネ。読み込めない場合はアイコンを表示 */
function Thumb({ url }: { url: string }) {
  const [failed, setFailed] = useState(false);
  if (!url || failed)
    return (
      <span className="shop-photo">
        <PhotoPlaceholder />
      </span>
    );
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
  const [loaded, setLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState('');
  const [pickerOpen, setPickerOpen] = useState(false);
  const [products, setProducts] = useState<Item[]>([]);
  const [pquery, setPquery] = useState('');
  const [addedIds, setAddedIds] = useState<string[]>([]);

  useEffect(() => {
    if (!currentGroup || !listId) return;
    setLoaded(false);
    setLoadError(false);
    // リアルタイム購読：家族の誰かがチェックすると即反映される。
    // 初回データが届かない時はタイムアウトで再読み込み可能な状態にする。
    return subscribeWithTimeout<ShoppingList | null>(
      (onData, onError) => watchShoppingList(currentGroup.id, listId, onData, onError),
      (l) => {
        setList(l);
        setLoaded(true);
        setLoadError(false);
      },
      () => {
        setLoadError(true);
        setLoaded(true);
      },
    );
  }, [currentGroup, listId, reloadKey]);

  if (!currentGroup || !loaded) return <div className="centered">読み込み中…</div>;

  if (!list) {
    return (
      <div className="page">
        <header className="form-header">
          <button className="icon-btn ghost" onClick={() => navigate('/lists')} aria-label="お使いリスト一覧へ戻る">
            <IconBack />
          </button>
        </header>
        <div className="empty">
          <IconCart />
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
            <p>このリストは見つかりませんでした。{'\n'}削除された可能性があります。</p>
          )}
        </div>
      </div>
    );
  }

  async function toggle(itemId: string) {
    if (!currentGroup || !list) return;
    const items = list.items.map((i) =>
      i.id === itemId ? { ...i, checked: !i.checked } : i,
    );
    // 書き込むと購読側に反映される（保留書き込みも即時反映）
    await updateShoppingList(currentGroup.id, list.id, { items });
  }

  /** 個数を増減（1〜99）。購読中の最新リストを書き戻す。 */
  async function changeQty(itemId: string, delta: number) {
    if (!currentGroup || !list) return;
    const items = list.items.map((i) =>
      i.id === itemId
        ? { ...i, quantity: Math.max(1, Math.min(99, (i.quantity || 1) + delta)) }
        : i,
    );
    await updateShoppingList(currentGroup.id, list.id, { items });
  }

  /** この商品をリストから削除（購読中の最新リストを書き戻す）。 */
  async function removeItem(itemId: string) {
    if (!currentGroup || !list) return;
    const items = list.items.filter((i) => i.id !== itemId);
    await updateShoppingList(currentGroup.id, list.id, { items });
  }

  /** リスト名を保存（空・変更なしは無視）。 */
  async function saveTitle() {
    setEditingTitle(false);
    if (!currentGroup || !list) return;
    const t = titleDraft.trim();
    if (t && t !== list.title) {
      await updateShoppingList(currentGroup.id, list.id, { title: t });
    }
  }

  /** 商品追加ピッカーを開き、商品カタログを読み込む。 */
  async function openProductPicker() {
    if (!currentGroup) return;
    setPquery('');
    setAddedIds([]);
    setPickerOpen(true);
    try {
      setProducts(await listItems(currentGroup.id));
    } catch {
      setProducts([]);
    }
  }

  /** カタログの商品をこのリストへ追加（個数1。後でステッパー調整可）。 */
  async function addProduct(it: Item) {
    if (!currentGroup || !list) return;
    await addItemToList(currentGroup.id, list.id, toShoppingListItem(it, 1));
    setAddedIds((prev) => [...prev, it.id]);
  }

  async function finishList() {
    if (!currentGroup || !list) return;
    const status = list.status === 'active' ? 'done' : 'active';
    await updateShoppingList(currentGroup.id, list.id, { status });
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
        <button className="icon-btn ghost" onClick={() => navigate('/lists')} aria-label="お使いリスト一覧へ戻る">
          <IconBack />
        </button>
        {editingTitle ? (
          <input
            className="title-input"
            value={titleDraft}
            autoFocus
            onChange={(e) => setTitleDraft(e.target.value)}
            onBlur={saveTitle}
            onKeyDown={(e) => {
              if (e.key === 'Enter') saveTitle();
              if (e.key === 'Escape') setEditingTitle(false);
            }}
          />
        ) : (
          <button
            className="title-edit"
            onClick={() => {
              setTitleDraft(list.title);
              setEditingTitle(true);
            }}
          >
            {list.title}
            <IconEdit className="title-pencil" />
          </button>
        )}
        <span className="progress">
          {checked}/{list.items.length}
        </span>
      </header>

      <button className="btn-secondary add-product" onClick={openProductPicker}>
        <IconPlus /> 商品を追加
      </button>

      {list.items.length > 0 && <p className="swipe-hint">← 左にスワイプで削除</p>}

      <ul className="shop-items">
        {list.items.map((it) => (
          <li key={it.id} className={it.checked ? 'checked' : ''}>
            <div className="swipe-track">
              <div className="swipe-content">
                <label>
                  <input
                    type="checkbox"
                    className="visually-hidden"
                    checked={it.checked}
                    onChange={() => toggle(it.id)}
                  />
                  <span className="check">{it.checked && <IconCheck />}</span>
                  <Thumb url={it.photoCache} />
                  <span className="shop-text">
                    <strong className="shop-name">{it.nameCache || '(名称なし)'}</strong>
                    <span className="shop-sub">{it.brandCache}</span>
                    {it.note && <em>メモ: {it.note}</em>}
                  </span>
                </label>
                <div className="qty-stepper sm">
                  <button
                    type="button"
                    onClick={() => changeQty(it.id, -1)}
                    disabled={(it.quantity || 1) <= 1}
                    aria-label="個数を減らす"
                  >
                    −
                  </button>
                  <span className="qty-value">{it.quantity || 1}</span>
                  <button
                    type="button"
                    onClick={() => changeQty(it.id, 1)}
                    disabled={(it.quantity || 1) >= 99}
                    aria-label="個数を増やす"
                  >
                    ＋
                  </button>
                </div>
              </div>
              <button
                type="button"
                className="swipe-delete"
                onClick={() => removeItem(it.id)}
                aria-label="リストから削除"
              >
                <IconTrash />
                削除
              </button>
            </div>
          </li>
        ))}
        {list.items.length === 0 && (
          <div className="empty">
            <IconCart />
            <p>商品詳細の「お使いに追加」から{'\n'}買ってきてほしいものを足しましょう。</p>
          </div>
        )}
      </ul>

      <button className="btn-primary" onClick={finishList}>
        {list.status === 'active' ? '完了にする' : '再開する'}
      </button>
      <button className="btn-danger" onClick={remove}>
        <IconTrash /> 削除
      </button>

      {pickerOpen && (
        <Sheet title="商品を追加" onClose={() => setPickerOpen(false)}>
          <div className="search-field">
            <IconSearch />
            <input
              placeholder="商品名・メーカーで検索"
              value={pquery}
              onChange={(e) => setPquery(e.target.value)}
            />
          </div>
          <ul className="picker-products">
            {products
              .filter((p) => {
                const kw = pquery.trim().toLowerCase();
                return (
                  !kw ||
                  p.name.toLowerCase().includes(kw) ||
                  p.brand.toLowerCase().includes(kw)
                );
              })
              .map((p) => {
                const photo = p.photos.find((x) => x.isPrimary) ?? p.photos[0];
                const count = addedIds.filter((id) => id === p.id).length;
                return (
                  <li key={p.id}>
                    <button className="product-row" onClick={() => addProduct(p)}>
                      <span className="shop-photo">
                        {photo ? <img src={photo.url} alt="" /> : <PhotoPlaceholder />}
                      </span>
                      <span className="shop-text">
                        <strong className="shop-name">{p.name}</strong>
                        <span className="shop-sub">{p.brand}</span>
                      </span>
                      {count > 0 ? (
                        <span className="added-badge">
                          <IconCheck /> {count}
                        </span>
                      ) : (
                        <IconPlus className="add-plus" />
                      )}
                    </button>
                  </li>
                );
              })}
            {products.length === 0 && (
              <p className="muted picker-empty">
                商品がありません。先に「商品」タブで登録してください。
              </p>
            )}
          </ul>
        </Sheet>
      )}
    </div>
  );
}

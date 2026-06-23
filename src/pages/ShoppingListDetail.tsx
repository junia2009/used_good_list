import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGroup } from '../contexts/GroupContext';
import {
  deleteShoppingList,
  updateShoppingList,
  watchShoppingList,
} from '../services/shoppingLists';
import { subscribeWithTimeout } from '../services/realtime';
import type { ShoppingList } from '../types';
import { IconBack, IconCheck, IconTrash, IconCart, PhotoPlaceholder } from '../components/icons';

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
        <h2>{list.title}</h2>
        <span className="progress">
          {checked}/{list.items.length}
        </span>
      </header>

      <ul className="shop-items">
        {list.items.map((it) => (
          <li key={it.id} className={it.checked ? 'checked' : ''}>
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
    </div>
  );
}

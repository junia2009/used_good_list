import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useAuth } from '../contexts/AuthContext';
import { useGroup } from '../contexts/GroupContext';
import {
  createItem,
  migrateItemCategories,
  reorderItems,
  sortItemsByOrder,
  watchItems,
  type ItemInput,
} from '../services/items';
import { subscribeWithTimeout } from '../services/realtime';
import { PRESET_GROUPS } from '../data/presets';
import type { Item } from '../types';
import Sheet from '../components/Sheet';
import { ProductIcon } from '../components/productIllustrations';
import { IconSearch, IconPlus, IconItems, IconChevron, PhotoPlaceholder } from '../components/icons';

/** カード中身（一覧・ドラッグ中で共通） */
function CardBody({ item }: { item: Item }) {
  const photo = item.photos.find((p) => p.isPrimary) ?? item.photos[0];
  return (
    <>
      <div className="item-photo">
        {photo ? (
          <img src={photo.url} alt={item.name} />
        ) : item.icon ? (
          <ProductIcon name={item.icon} />
        ) : (
          <PhotoPlaceholder />
        )}
        {item.inStock === false && <span className="stock-dot">在庫切れ</span>}
      </div>
      <div className="item-body">
        <div className="item-name">{item.name}</div>
        <div className="item-brand">{item.brand}</div>
      </div>
    </>
  );
}

/** 長押しで並び替えできるカード。タップ（ドラッグせず）で詳細へ遷移 */
function SortableCard({ item }: { item: Item }) {
  const navigate = useNavigate();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
    zIndex: isDragging ? 2 : undefined,
    touchAction: 'manipulation' as const,
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      className="item-card"
      onClick={() => navigate(`/items/${item.id}`)}
      {...attributes}
      {...listeners}
    >
      <CardBody item={item} />
    </div>
  );
}

export default function ItemList() {
  const { user } = useAuth();
  const { currentGroup } = useGroup();
  const navigate = useNavigate();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('すべて');
  const [presetOpen, setPresetOpen] = useState(false);
  const [addingPreset, setAddingPreset] = useState<string>('');
  // グループごとに一度だけ旧カテゴリ移行を試みる
  const migratedRef = useRef<string | null>(null);

  const sensors = useSensors(
    // マウスは少し動かしてからドラッグ開始（クリックと区別）
    useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
    // タッチは長押し（200ms）でドラッグ開始。スクロールは許容
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  useEffect(() => {
    if (!currentGroup) {
      navigate('/groups');
      return;
    }
    setLoading(true);
    setLoadError(false);
    return subscribeWithTimeout<Item[]>(
      (onData, onError) => watchItems(currentGroup.id, onData, onError),
      (its) => {
        setItems(sortItemsByOrder(its));
        setLoading(false);
        setLoadError(false);
        // 旧カテゴリ（食品/調味料/飲料/洗剤）を新3分類へ自動移行（一度だけ・冪等）
        if (migratedRef.current !== currentGroup.id) {
          migratedRef.current = currentGroup.id;
          migrateItemCategories(currentGroup.id, its).catch(() => undefined);
        }
      },
      () => {
        setLoadError(true);
        setLoading(false);
      },
    );
  }, [currentGroup, navigate, reloadKey]);

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

  // 絞り込み中は並び替えを無効化（表示順と全体順がずれるため）
  const reorderable = category === 'すべて' && keyword.trim() === '';

  function handleDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (!currentGroup || !over || active.id === over.id) return;
    const oldIndex = items.findIndex((i) => i.id === active.id);
    const newIndex = items.findIndex((i) => i.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;
    const next = arrayMove(items, oldIndex, newIndex);
    setItems(next); // 楽観的更新
    // 失敗時はリアルタイム購読が元の順序へ戻す
    reorderItems(
      currentGroup.id,
      next.map((i) => i.id),
    ).catch(() => undefined);
  }

  const existingNames = useMemo(() => new Set(items.map((i) => i.name)), [items]);

  /** 定番商品を自分のグループへ登録（写真なし・イラスト付き）。 */
  async function addPreset(p: ItemInput) {
    if (!user || !currentGroup) return;
    setAddingPreset(p.name);
    try {
      await createItem(currentGroup.id, user.uid, p);
    } finally {
      setAddingPreset('');
    }
  }

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

      <button className="btn-secondary preset-open" onClick={() => setPresetOpen(true)}>
        <IconPlus /> 定番商品から追加
      </button>

      {loading ? (
        <div className="centered">読み込み中…</div>
      ) : loadError ? (
        <div className="empty">
          <IconItems />
          <p>読み込みに失敗しました。{'\n'}電波の良い場所でお試しください。</p>
          <button
            className="btn-secondary"
            style={{ maxWidth: 240, margin: '12px auto 0' }}
            onClick={() => setReloadKey((k) => k + 1)}
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
      ) : reorderable ? (
        <>
          {items.length > 1 && <p className="reorder-hint">長押しで並び替えできます</p>}
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={filtered.map((i) => i.id)} strategy={rectSortingStrategy}>
              <div className="item-grid">
                {filtered.map((item) => (
                  <SortableCard key={item.id} item={item} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </>
      ) : (
        <div className="item-grid">
          {filtered.map((item) => (
            <Link key={item.id} to={`/items/${item.id}`} className="item-card">
              <CardBody item={item} />
            </Link>
          ))}
        </div>
      )}

      <button className="fab" onClick={() => navigate('/items/new')} aria-label="商品を追加">
        <IconPlus />
      </button>

      {presetOpen && (
        <Sheet title="定番商品から追加" onClose={() => setPresetOpen(false)}>
          {PRESET_GROUPS.map((g) => (
            <div key={g.label}>
              <p className="preset-group-label">{g.label}</p>
              <div className="preset-grid">
                {g.items.map((p) => {
                  const added = existingNames.has(p.name);
                  return (
                    <button
                      key={p.name}
                      className={`preset-tile${added ? ' added' : ''}`}
                      disabled={added || addingPreset === p.name}
                      onClick={() => addPreset(p)}
                    >
                      <span className="preset-illust-box">
                        {p.icon ? <ProductIcon name={p.icon} /> : <PhotoPlaceholder />}
                      </span>
                      <span className="preset-name">{p.name}</span>
                      {added && <span className="preset-added">登録済み</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </Sheet>
      )}
    </div>
  );
}

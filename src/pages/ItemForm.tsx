import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useGroup } from '../contexts/GroupContext';
import {
  createItem,
  getItem,
  setItemPhotos,
  updateItem,
  type ItemInput,
} from '../services/items';
import { deleteItemPhoto, uploadItemPhoto } from '../services/storage';
import type { Photo } from '../types';
import { IconClose, IconCamera } from '../components/icons';

const CATEGORIES = ['食料品', '日用品', 'その他'];

export default function ItemForm() {
  const { itemId } = useParams();
  const isEdit = Boolean(itemId);
  const { user } = useAuth();
  const { currentGroup } = useGroup();
  const navigate = useNavigate();

  const [form, setForm] = useState<ItemInput>({ name: '', brand: '', category: '' });
  const [files, setFiles] = useState<File[]>([]);
  const [existingPhotos, setExistingPhotos] = useState<Photo[]>([]);
  const [removedPaths, setRemovedPaths] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit && currentGroup && itemId) {
      getItem(currentGroup.id, itemId).then((item) => {
        if (!item) return;
        setForm({
          name: item.name,
          brand: item.brand,
          category: item.category ?? '',
          store: item.store ?? '',
          size: item.size ?? '',
          note: item.note ?? '',
          url: item.url ?? '',
        });
        setExistingPhotos(item.photos);
      });
    }
  }, [isEdit, currentGroup, itemId]);

  function set<K extends keyof ItemInput>(key: K, value: ItemInput[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  /** 既存写真を一覧から外す（保存時に Storage からも削除）。代表写真なら別の写真へ引き継ぐ */
  function removeExistingPhoto(target: Photo) {
    setExistingPhotos((prev) => {
      const next = prev.filter((p) => p.path !== target.path);
      if (target.isPrimary && next.length > 0 && !next.some((p) => p.isPrimary)) {
        next[0] = { ...next[0], isPrimary: true };
      }
      return next;
    });
    setRemovedPaths((prev) => [...prev, target.path]);
  }

  /** 追加予定（未アップロード）の写真を取り消す */
  function removeNewFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSave() {
    if (!user || !currentGroup) return;
    if (!form.name.trim() || !form.brand.trim()) {
      setError('商品名とメーカーは必須です');
      return;
    }
    setBusy(true);
    setError('');
    try {
      const id = isEdit
        ? itemId!
        : await createItem(currentGroup.id, user.uid, form);
      if (isEdit) await updateItem(currentGroup.id, id, form);

      if (files.length > 0 || removedPaths.length > 0) {
        const uploaded = await Promise.all(
          files.map((f) => uploadItemPhoto(currentGroup.id, id, f)),
        );
        const photos: Photo[] = [
          ...existingPhotos,
          ...uploaded.map((u, i) => ({
            ...u,
            isPrimary: existingPhotos.length === 0 && i === 0,
          })),
        ];
        // 代表写真が消えてしまった場合は先頭を代表にする
        if (photos.length > 0 && !photos.some((p) => p.isPrimary)) {
          photos[0] = { ...photos[0], isPrimary: true };
        }
        await setItemPhotos(currentGroup.id, id, photos);
        // 削除された写真の実体を Storage から消す（失敗しても保存は継続）
        await Promise.all(
          removedPaths.map((p) => deleteItemPhoto(p).catch(() => undefined)),
        );
      }
      navigate(`/items/${id}`);
    } catch {
      setError('保存に失敗しました');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="page">
      <header className="form-header">
        <button
          className="icon-btn ghost"
          onClick={() => navigate(isEdit ? `/items/${itemId}` : '/items')}
          aria-label="キャンセル"
        >
          <IconClose />
        </button>
        <h2>{isEdit ? '商品を編集' : '商品を登録'}</h2>
        <button className="btn-primary sm" disabled={busy} onClick={handleSave}>
          保存
        </button>
      </header>

      <div className="photo-row">
        {existingPhotos.map((p) => (
          <div key={p.path} className="thumb-wrap">
            <img className="thumb" src={p.url} alt="" />
            <button
              type="button"
              className="thumb-del"
              onClick={() => removeExistingPhoto(p)}
              aria-label="写真を削除"
            >
              <IconClose />
            </button>
          </div>
        ))}
        {files.map((f, i) => (
          <div key={i} className="thumb-wrap">
            <img className="thumb" src={URL.createObjectURL(f)} alt="" />
            <button
              type="button"
              className="thumb-del"
              onClick={() => removeNewFile(i)}
              aria-label="写真を削除"
            >
              <IconClose />
            </button>
          </div>
        ))}
        <label className="photo-add">
          <IconCamera />
          写真を追加
          <input
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={(e) => setFiles([...files, ...Array.from(e.target.files ?? [])])}
          />
        </label>
      </div>
      <p className="photo-hint">写真は任意です。あとから追加・変更できます。</p>

      <label className="field">
        商品名<span className="req">必須</span>
        <input value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="例：おしゃれ着用洗剤 エマール" />
      </label>
      <label className="field">
        メーカー<span className="req">必須</span>
        <input value={form.brand} onChange={(e) => set('brand', e.target.value)} placeholder="例：花王" />
      </label>
      <label className="field">
        カテゴリ
        <select value={form.category} onChange={(e) => set('category', e.target.value)}>
          <option value="">（未選択）</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>
      <label className="field">
        容量・規格
        <input value={form.size ?? ''} onChange={(e) => set('size', e.target.value)} />
      </label>
      <label className="field">
        購入場所
        <input value={form.store ?? ''} onChange={(e) => set('store', e.target.value)} />
      </label>
      <label className="field">
        URL
        <input
          type="url"
          inputMode="url"
          value={form.url ?? ''}
          onChange={(e) => set('url', e.target.value)}
          placeholder="例：https://www.kao.co.jp/emal/"
        />
      </label>
      <label className="field">
        メモ
        <textarea
          className="note-area"
          rows={6}
          value={form.note ?? ''}
          onChange={(e) => set('note', e.target.value)}
          placeholder="例：詰め替え用が安い。Aスーパーの方が10円安かった。香りはフローラル。"
        />
      </label>

      {error && <p className="error">{error}</p>}
    </div>
  );
}

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
import { uploadItemPhoto } from '../services/storage';
import type { Photo } from '../types';

const CATEGORIES = ['洗剤', '食品', '日用品', '飲料', '調味料', 'その他'];

export default function ItemForm() {
  const { itemId } = useParams();
  const isEdit = Boolean(itemId);
  const { user } = useAuth();
  const { currentGroup } = useGroup();
  const navigate = useNavigate();

  const [form, setForm] = useState<ItemInput>({ name: '', brand: '', category: '' });
  const [files, setFiles] = useState<File[]>([]);
  const [existingPhotos, setExistingPhotos] = useState<Photo[]>([]);
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
        });
        setExistingPhotos(item.photos);
      });
    }
  }, [isEdit, currentGroup, itemId]);

  function set<K extends keyof ItemInput>(key: K, value: ItemInput[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSave() {
    if (!user || !currentGroup) return;
    if (!form.name.trim() || !form.brand.trim()) {
      setError('商品名とメーカーは必須です');
      return;
    }
    if (!isEdit && files.length === 0) {
      setError('写真を1枚以上追加してください');
      return;
    }
    setBusy(true);
    setError('');
    try {
      const id = isEdit
        ? itemId!
        : await createItem(currentGroup.id, user.uid, form);
      if (isEdit) await updateItem(currentGroup.id, id, form);

      if (files.length > 0) {
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
        await setItemPhotos(currentGroup.id, id, photos);
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
        <button className="link" onClick={() => navigate(-1)}>
          ✕ キャンセル
        </button>
        <h2>{isEdit ? '商品を編集' : '商品を登録'}</h2>
        <button className="btn-primary sm" disabled={busy} onClick={handleSave}>
          保存
        </button>
      </header>

      <div className="photo-row">
        {existingPhotos.map((p) => (
          <img key={p.path} className="thumb" src={p.url} alt="" />
        ))}
        {files.map((f, i) => (
          <img key={i} className="thumb" src={URL.createObjectURL(f)} alt="" />
        ))}
        <label className="photo-add">
          📷
          <input
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={(e) => setFiles([...files, ...Array.from(e.target.files ?? [])])}
          />
        </label>
      </div>

      <label className="field">
        商品名 *
        <input value={form.name} onChange={(e) => set('name', e.target.value)} />
      </label>
      <label className="field">
        メーカー *
        <input value={form.brand} onChange={(e) => set('brand', e.target.value)} />
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
        メモ
        <textarea value={form.note ?? ''} onChange={(e) => set('note', e.target.value)} />
      </label>

      {error && <p className="error">{error}</p>}
    </div>
  );
}

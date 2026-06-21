import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '../firebase';

/** 画像を長辺 maxSize まで縮小し JPEG Blob にする（アップロード前の最適化） */
export async function compressImage(file: File, maxSize = 1280, quality = 0.8): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context を取得できませんでした');
  ctx.drawImage(bitmap, 0, 0, w, h);
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('画像の変換に失敗しました'))),
      'image/jpeg',
      quality,
    );
  });
}

/** 商品写真をアップロードし { path, url } を返す */
export async function uploadItemPhoto(
  groupId: string,
  itemId: string,
  file: File,
): Promise<{ path: string; url: string }> {
  const blob = await compressImage(file);
  const photoId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`;
  const path = `groups/${groupId}/items/${itemId}/${photoId}`;
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, blob, { contentType: 'image/jpeg' });
  const url = await getDownloadURL(storageRef);
  return { path, url };
}

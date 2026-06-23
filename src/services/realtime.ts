/**
 * リアルタイム購読に「初回データのタイムアウト」を付与する共通ラッパー。
 *
 * onSnapshot は端末キャッシュにデータがあれば即返すが、そのクエリの
 * キャッシュが空（その画面を一度も開いていない／キャッシュ破棄後）だと
 * 「データ無し」と「未取得」を区別できず、サーバの初回応答を待つ。
 * PWA 再開直後など接続が滞った状態ではこの初回応答が来ず、「読み込み中」で
 * 固まってしまう。
 *
 * そこで一定時間内に最初のデータもエラーも来なければ onError を呼び、
 * 画面側を（再読み込み可能な）エラー状態へ復帰させる。購読自体は維持する
 * ため、後から接続が復旧してデータが届けば onData が呼ばれて自動回復する。
 */
export function subscribeWithTimeout<T>(
  subscribe: (onData: (d: T) => void, onError: (e: Error) => void) => () => void,
  onData: (d: T) => void,
  onError: (e: Error) => void,
  timeoutMs = 8000,
): () => void {
  let settled = false;
  const timer = setTimeout(() => {
    if (!settled) onError(new Error('timeout'));
  }, timeoutMs);
  const unsub = subscribe(
    (d) => {
      settled = true;
      clearTimeout(timer);
      onData(d);
    },
    (e) => {
      settled = true;
      clearTimeout(timer);
      onError(e);
    },
  );
  return () => {
    clearTimeout(timer);
    unsub();
  };
}

/** Promise に上限時間を設ける。超過で reject。一発取得が固まるのを防ぐ用途。 */
export function withTimeout<T>(promise: Promise<T>, timeoutMs = 8000): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('timeout')), timeoutMs);
    promise.then(
      (v) => {
        clearTimeout(timer);
        resolve(v);
      },
      (e) => {
        clearTimeout(timer);
        reject(e);
      },
    );
  });
}

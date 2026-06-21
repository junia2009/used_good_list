import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useGroup } from '../contexts/GroupContext';
import { joinGroup } from '../services/groups';

type Status = 'idle' | 'joining' | 'error';

export default function Join() {
  const [params] = useSearchParams();
  const code = (params.get('code') ?? '').toUpperCase();
  const { user, loading, signInWithGoogle } = useAuth();
  const { selectGroup, refreshGroups } = useGroup();
  const navigate = useNavigate();
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');
  const attempted = useRef(false);

  useEffect(() => {
    if (loading || !user || !code || attempted.current) return;
    attempted.current = true;
    setStatus('joining');
    joinGroup(code, user)
      .then(async (groupId) => {
        await refreshGroups();
        selectGroup(groupId);
        navigate('/items', { replace: true });
      })
      .catch((e) => {
        setError(e instanceof Error ? e.message : '参加に失敗しました');
        setStatus('error');
      });
  }, [loading, user, code, navigate, refreshGroups, selectGroup]);

  async function handleLogin() {
    try {
      await signInWithGoogle();
    } catch {
      setError('ログインに失敗しました');
    }
  }

  if (!code) {
    return <div className="centered">招待コードが指定されていません</div>;
  }
  if (loading) {
    return <div className="centered">読み込み中…</div>;
  }

  // 未ログイン：ログインを促す（ログイン後に上の effect が参加処理を実行）
  if (!user) {
    return (
      <div className="login-screen">
        <h1 className="brand">Pacto</h1>
        <p className="tagline">グループに招待されています</p>
        <p className="muted">招待コード: {code}</p>
        <button className="btn-primary" onClick={handleLogin}>
          Google でログインして参加
        </button>
        {error && <p className="error">{error}</p>}
      </div>
    );
  }

  return (
    <div className="login-screen">
      <h1 className="brand">Pacto</h1>
      {status === 'error' ? (
        <>
          <p className="error">参加できませんでした：{error}</p>
          <button className="btn-secondary" onClick={() => navigate('/groups')}>
            グループ一覧へ
          </button>
        </>
      ) : (
        <p className="tagline">グループに参加しています…</p>
      )}
    </div>
  );
}

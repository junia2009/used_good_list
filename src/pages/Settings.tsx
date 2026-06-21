import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useGroup } from '../contexts/GroupContext';
import { createInvite, getMembers } from '../services/groups';
import type { Member } from '../types';
import { IconShare, IconCopy, IconSwap, IconLogout } from '../components/icons';

export default function Settings() {
  const { user, logout } = useAuth();
  const { currentGroup } = useGroup();
  const navigate = useNavigate();
  const [members, setMembers] = useState<Member[]>([]);
  const [invite, setInvite] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (currentGroup) getMembers(currentGroup.id).then(setMembers);
  }, [currentGroup]);

  const inviteUrl = invite ? `${window.location.origin}/join?code=${invite}` : '';

  async function handleInvite() {
    if (!user || !currentGroup) return;
    setCopied(false);
    const code = await createInvite(currentGroup.id, user.uid);
    setInvite(code);
  }

  async function handleShare() {
    if (!currentGroup) return;
    const text = `「${currentGroup.name}」に招待します。このリンクから参加してね:`;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Pacto への招待', text, url: inviteUrl });
        return;
      } catch {
        /* キャンセル時は何もしない */
      }
    }
    await handleCopy();
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="page">
      <h2>設定</h2>

      <section className="card">
        <div className="profile">
          {user?.photoURL && <img src={user.photoURL} alt="" className="avatar" />}
          <div>
            <strong>{user?.displayName}</strong>
            <div className="muted">{user?.email}</div>
          </div>
        </div>
      </section>

      {currentGroup && (
        <section className="card">
          <h3>グループ「{currentGroup.name}」</h3>
          <p className="muted">メンバー {members.length} 人</p>
          <ul className="member-list">
            {members.map((m) => (
              <li key={m.uid}>
                {m.photoURL && <img src={m.photoURL} alt="" className="avatar sm" />}
                {m.displayName} {m.role === 'owner' && <span className="badge">オーナー</span>}
              </li>
            ))}
          </ul>
          <button className="btn-secondary" onClick={handleInvite}>
            招待リンクを作る
          </button>
          {invite && (
            <div className="invite-box">
              <p className="muted">このリンクを家族に送ってください（7日間有効）</p>
              <input className="invite-url" readOnly value={inviteUrl} onFocus={(e) => e.target.select()} />
              <div className="invite-actions">
                <button className="btn-primary" onClick={handleShare}>
                  <IconShare /> 共有する
                </button>
                <button className="btn-secondary" onClick={handleCopy}>
                  <IconCopy /> {copied ? 'コピーしました' : 'リンクをコピー'}
                </button>
              </div>
              <p className="muted sm">招待コード: {invite}（手入力でも参加できます）</p>
            </div>
          )}
        </section>
      )}

      <section className="card">
        <button className="btn-secondary" onClick={() => navigate('/groups')}>
          <IconSwap /> グループを切り替える
        </button>
        <button
          className="btn-danger"
          onClick={async () => {
            await logout();
            navigate('/login');
          }}
        >
          <IconLogout /> ログアウト
        </button>
      </section>

      <p className="version">
        Pacto v{__APP_VERSION__}
        <br />
        {__APP_BUILD_DATE__} ・ {__APP_COMMIT__}
      </p>
    </div>
  );
}

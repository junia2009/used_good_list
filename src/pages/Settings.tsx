import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useGroup } from '../contexts/GroupContext';
import { createInvite, getMembers } from '../services/groups';
import type { Member } from '../types';

export default function Settings() {
  const { user, logout } = useAuth();
  const { currentGroup } = useGroup();
  const navigate = useNavigate();
  const [members, setMembers] = useState<Member[]>([]);
  const [invite, setInvite] = useState('');

  useEffect(() => {
    if (currentGroup) getMembers(currentGroup.id).then(setMembers);
  }, [currentGroup]);

  async function handleInvite() {
    if (!user || !currentGroup) return;
    const code = await createInvite(currentGroup.id, user.uid);
    setInvite(code);
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
            招待コードを作る
          </button>
          {invite && (
            <p className="invite-code">
              招待コード: <strong>{invite}</strong>（7日間有効）
            </p>
          )}
        </section>
      )}

      <section className="card">
        <button className="btn-secondary" onClick={() => navigate('/groups')}>
          グループを切り替える
        </button>
        <button
          className="btn-danger"
          onClick={async () => {
            await logout();
            navigate('/login');
          }}
        >
          ログアウト
        </button>
      </section>
    </div>
  );
}

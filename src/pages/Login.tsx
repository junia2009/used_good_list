import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const { signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  async function handleLogin() {
    try {
      await signInWithGoogle();
      navigate('/');
    } catch {
      setError('ログインに失敗しました。もう一度お試しください。');
    }
  }

  return (
    <div className="login-screen">
      <svg className="brand-mark" viewBox="0 0 64 64" aria-hidden>
        <rect width="64" height="64" rx="18" fill="#c2703d" />
        <text
          x="32"
          y="45"
          textAnchor="middle"
          fontSize="36"
          fontFamily="Georgia, 'Times New Roman', serif"
          fontWeight="600"
          fill="#fffdfa"
        >
          P
        </text>
      </svg>
      <h1 className="brand">Pacto</h1>
      <p className="tagline">いつものやつを、ふたりで。</p>
      <button className="btn-primary" onClick={handleLogin}>
        Google でログイン
      </button>
      {error && <p className="error">{error}</p>}
    </div>
  );
}

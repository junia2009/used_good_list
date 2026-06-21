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
      <svg className="brand-mark" viewBox="0 0 512 512" aria-hidden>
        <rect width="512" height="512" rx="112" fill="#c2703d" />
        <path
          d="M150 232 L362 232 L392 372 Q397 400 369 400 L143 400 Q115 400 120 372 Z"
          fill="#f7ece0"
        />
        <path
          d="M196 232 V184 a60 60 0 0 1 120 0 V232"
          fill="none"
          stroke="#f7ece0"
          strokeWidth="30"
          strokeLinecap="round"
        />
        <path d="M256 296 c0 30 -20 50 -52 52 c0 -30 20 -50 52 -52 Z" fill="#6e7256" />
        <path d="M256 296 c0 30 20 50 52 52 c0 -30 -20 -50 -52 -52 Z" fill="#6e7256" />
        <path d="M256 290 v72" stroke="#6e7256" strokeWidth="11" strokeLinecap="round" />
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

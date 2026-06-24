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
        <defs>
          <linearGradient id="loginG" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#E8835A" />
            <stop offset="1" stopColor="#C95A3B" />
          </linearGradient>
          <linearGradient id="loginSh" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff" stopOpacity="0.16" />
            <stop offset="0.5" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect width="512" height="512" rx="115" fill="url(#loginG)" />
        <rect width="512" height="512" rx="115" fill="url(#loginSh)" />
        <g transform="translate(256 256) scale(1.14) translate(-256 -256) translate(0 -33)">
          <path
            d="M 158 196 H 354 Q 382 196 382 224 L 396 400 Q 396 428 368 428 H 144 Q 116 428 116 400 L 130 224 Q 130 196 158 196 Z"
            fill="#FBF1E4"
          />
          <path
            d="M 200 206 V 198 a 56 48 0 0 1 112 0 V 206"
            fill="none"
            stroke="#FBF1E4"
            strokeWidth="28"
            strokeLinecap="round"
          />
          <path
            d="M 202.32 319.12 L 241.36 360.6 L 312.12 280.08"
            fill="none"
            stroke="#C95A3B"
            strokeWidth="32"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </svg>
      <h1 className="brand">Pacto</h1>
      <p className="tagline">いつものやつを、家族みんなで。</p>
      <button className="btn-primary" onClick={handleLogin}>
        Google でログイン
      </button>
      {error && <p className="error">{error}</p>}
    </div>
  );
}

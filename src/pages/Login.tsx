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
      <h1 className="brand">Pacto</h1>
      <p className="tagline">いつものやつを、みんなで共有</p>
      <button className="btn-primary" onClick={handleLogin}>
        Google でログイン
      </button>
      {error && <p className="error">{error}</p>}
    </div>
  );
}

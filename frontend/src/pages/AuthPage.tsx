import React, { useState } from 'react';
import styles from './AuthPage.module.css';

type Tab = 'login' | 'register';

interface Props {
  onLogin: (u: string, p: string) => Promise<void>;
  onRegister: (u: string, p: string) => Promise<void>;
}

export default function AuthPage({ onLogin, onRegister }: Props) {
  const [tab,      setTab]      = useState<Tab>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  const switchTab = (t: Tab) => { setTab(t); setError(''); };

  const submit = async () => {
    if (!username.trim() || !password.trim()) { setError('Please fill in all fields'); return; }
    setLoading(true); setError('');
    try {
      if (tab === 'login') await onLogin(username, password);
      else await onRegister(username, password);
    } catch (e: any) {
      setError(e?.response?.data?.detail ?? e?.message ?? 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.screen}>
      <div className={styles.bg} />
      <div className={styles.card}>
        <div className={styles.logo}>Task<span>Flow</span></div>
        <div className={styles.subtitle}>Manage your work, beautifully.</div>

        <div className={styles.tabs}>
          <button className={`${styles.tab} ${tab === 'login'    ? styles.active : ''}`} onClick={() => switchTab('login')}>Sign In</button>
          <button className={`${styles.tab} ${tab === 'register' ? styles.active : ''}`} onClick={() => switchTab('register')}>Create Account</button>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.field}>
          <label>Username</label>
          <input
            type="text" value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
            placeholder="your_username" autoFocus
          />
        </div>
        <div className={styles.field}>
          <label>Password</label>
          <input
            type="password" value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
            placeholder="••••••••"
          />
        </div>

        <button className={styles.btn} onClick={submit} disabled={loading}>
          {loading ? 'Please wait…' : tab === 'login' ? 'Sign In →' : 'Create Account →'}
        </button>
      </div>
    </div>
  );
}

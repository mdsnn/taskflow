import { useState } from 'react';
import { login as apiLogin, register as apiRegister } from '../api/auth';

export function useAuth() {
  const [token, setToken]       = useState(() => localStorage.getItem('tf_token') ?? '');
  const [username, setUsername] = useState(() => localStorage.getItem('tf_user') ?? '');

  const persist = (t: string, u: string) => {
    localStorage.setItem('tf_token', t);
    localStorage.setItem('tf_user', u);
    setToken(t);
    setUsername(u);
  };

  const login = async (u: string, p: string) => {
    const data = await apiLogin(u, p);
    persist(data.access_token, data.username);
  };

  const register = async (u: string, p: string) => {
    const data = await apiRegister(u, p);
    persist(data.access_token, data.username);
  };

  const logout = () => {
    localStorage.removeItem('tf_token');
    localStorage.removeItem('tf_user');
    setToken('');
    setUsername('');
  };

  return { token, username, login, register, logout, isAuthed: !!token };
}

import React from 'react';
import { useAuth } from './hooks/useAuth';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';

export default function App() {
  const { token, username, login, register, logout, isAuthed } = useAuth();

  if (!isAuthed) {
    return <AuthPage onLogin={login} onRegister={register} />;
  }

  return <DashboardPage token={token} username={username} onLogout={logout} />;
}

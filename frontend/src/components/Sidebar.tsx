import React from 'react';
import { FilterMode } from '../types';
import styles from './Sidebar.module.css';

interface Props {
  username: string;
  filter: FilterMode;
  onFilterChange: (f: FilterMode) => void;
  onLogout: () => void;
}

const VIEWS: { key: FilterMode; icon: string; label: string }[] = [
  { key: 'all',       icon: '📋', label: 'All Tasks'       },
  { key: 'active',    icon: '⚡', label: 'Active Tasks'    },
  { key: 'completed', icon: '✅', label: 'Completed Tasks' },
];

export default function Sidebar({ username, filter, onFilterChange, onLogout }: Props) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>Task<span>Flow</span></div>

      <div className={styles.navLabel}>Views</div>
      {VIEWS.map(({ key, icon, label }) => (
        <button
          key={key}
          className={`${styles.navBtn} ${filter === key ? styles.active : ''}`}
          onClick={() => onFilterChange(key)}
        >
          <span className={styles.icon}>{icon}</span>
          {label}
        </button>
      ))}

      <div className={styles.spacer} />

      <div className={styles.userBadge}>
        <div className={styles.avatar}>{username[0]?.toUpperCase()}</div>
        <div className={styles.userName}>{username}</div>
        <button className={styles.logoutBtn} onClick={onLogout} title="Sign out">⎋</button>
      </div>
    </aside>
  );
}

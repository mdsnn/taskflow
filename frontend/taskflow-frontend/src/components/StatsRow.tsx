import React from 'react';
import { Stats } from '../types';
import styles from './StatsRow.module.css';

interface Props { stats: Stats; }

export default function StatsRow({ stats }: Props) {
  const cards = [
    { label: 'Total',  value: stats.total,                 color: 'var(--accent)'  },
    { label: 'Active', value: stats.active,                color: 'var(--med)'     },
    { label: 'Done',   value: stats.completed,             color: 'var(--accent3)' },
    { label: '% Done', value: `${stats.completion_rate}%`, color: 'var(--accent2)' },
  ];

  return (
    <div className={styles.row}>
      {cards.map((c) => (
        <div className={styles.card} key={c.label}>
          <div className={styles.value} style={{ color: c.color }}>{c.value}</div>
          <div className={styles.label}>{c.label}</div>
        </div>
      ))}
    </div>
  );
}

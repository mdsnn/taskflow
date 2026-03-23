import React from 'react';
import { Task } from '../types';
import styles from './TaskCard.module.css';

interface Props {
  task: Task;
  onToggle: (t: Task) => void;
  onEdit: (t: Task) => void;
  onDelete: (id: string) => void;
}

const fmt = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

export default function TaskCard({ task, onToggle, onEdit, onDelete }: Props) {
  return (
    <div className={`${styles.card} ${task.completed ? styles.completed : ''}`}>
      <button
        className={`${styles.check} ${task.completed ? styles.checked : ''}`}
        onClick={() => onToggle(task)}
        aria-label="Toggle complete"
      />
      <div className={styles.body}>
        <div className={styles.title}>{task.title}</div>
        {task.description && <div className={styles.desc}>{task.description}</div>}
        <div className={styles.meta}>
          <span className={`${styles.badge} ${styles[task.priority]}`}>{task.priority}</span>
          <span className={styles.date}>{fmt(task.created_at)}</span>
        </div>
      </div>
      <div className={styles.actions}>
        <button className={styles.iconBtn}                        onClick={() => onEdit(task)}   title="Edit">✎</button>
        <button className={`${styles.iconBtn} ${styles.del}`}    onClick={() => onDelete(task.id)} title="Delete">✕</button>
      </div>
    </div>
  );
}

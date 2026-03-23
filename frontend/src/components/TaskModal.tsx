import React, { useState } from 'react';
import { Priority, Task, TaskPayload } from '../types';
import styles from './TaskModal.module.css';

interface Props {
  task: Task | null;
  onSave: (payload: TaskPayload) => void;
  onClose: () => void;
}

export default function TaskModal({ task, onSave, onClose }: Props) {
  const [title,    setTitle]    = useState(task?.title       ?? '');
  const [desc,     setDesc]     = useState(task?.description ?? '');
  const [priority, setPriority] = useState<Priority>(task?.priority ?? 'medium');

  const save = () => {
    if (!title.trim()) return;
    onSave({ title: title.trim(), description: desc.trim(), priority });
  };

  return (
    <div
      className={styles.overlay}
      onClick={(e) => { if ((e.target as HTMLElement).classList.contains(styles.overlay)) onClose(); }}
    >
      <div className={styles.modal}>
        <div className={styles.title}>{task ? 'Edit Task' : 'New Task'}</div>

        <div className={styles.field}>
          <label>Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && save()}
            placeholder="What needs to be done?"
            autoFocus
          />
        </div>

        <div className={styles.field}>
          <label>Description</label>
          <textarea value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Optional details…" />
        </div>

        <div className={styles.field}>
          <label>Priority</label>
          <select value={priority} onChange={(e) => setPriority(e.target.value as Priority)}>
            <option value="high">🔴 High</option>
            <option value="medium">🟡 Medium</option>
            <option value="low">🟢 Low</option>
          </select>
        </div>

        <div className={styles.actions}>
          <button className={styles.ghost}  onClick={onClose}>Cancel</button>
          <button className={styles.submit} onClick={save} disabled={!title.trim()}>
            {task ? 'Save Changes' : 'Add Task'}
          </button>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import StatsRow from '../components/StatsRow';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import { FilterMode, Task, TaskPayload } from '../types';
import { useTasks } from '../hooks/useTasks';
import styles from './DashboardPage.module.css';

interface Props {
  token: string;
  username: string;
  onLogout: () => void;
}

export default function DashboardPage({ token, username, onLogout }: Props) {
  const [filter, setFilter] = useState<FilterMode>('all');
  const [search, setSearch] = useState('');
  const [modal,  setModal]  = useState<Task | 'new' | null>(null);

  const { tasks, stats, loading, create, update, remove, toggle } = useTasks(token, filter);

  const handleSave = async (payload: TaskPayload) => {
    if (modal === 'new') await create(payload);
    else if (modal)      await update((modal as Task).id, payload);
    setModal(null);
  };

  const filtered = tasks.filter((t) =>
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.description.toLowerCase().includes(search.toLowerCase())
  );

  const titles: Record<FilterMode, string> = {
    all: 'All Tasks', active: 'Active Tasks', completed: 'Completed',
  };

  return (
    <div className={styles.app}>
      <Sidebar username={username} filter={filter} onFilterChange={setFilter} onLogout={onLogout} />

      <main className={styles.main}>
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.pageTitle}>{titles[filter]}</h1>
          <p className={styles.pageDesc}>
            {stats
              ? `${stats.total} total · ${stats.completed} done · ${stats.completion_rate}% complete`
              : 'Loading…'}
          </p>
          {stats && stats.total > 0 && (
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: `${stats.completion_rate}%` }} />
            </div>
          )}
        </div>

        {/* Stats */}
        {stats && <StatsRow stats={stats} />}

        {/* Controls */}
        <div className={styles.controls}>
          <input
            className={styles.search}
            placeholder="🔍  Search tasks…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className={styles.filterBtns}>
            {(['all', 'active', 'completed'] as FilterMode[]).map((f) => (
              <button
                key={f}
                className={`${styles.filterBtn} ${filter === f ? styles.active : ''}`}
                onClick={() => setFilter(f)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
          <button className={styles.addBtn} onClick={() => setModal('new')}>＋ New Task</button>
        </div>

        {/* Task list */}
        <div className={styles.list}>
          {loading && <div className={styles.empty}>Loading…</div>}

          {!loading && filtered.length === 0 && (
            <div className={styles.empty}>
              <div className={styles.emptyIcon}>{filter === 'completed' ? '🎉' : '📭'}</div>
              <div className={styles.emptyText}>
                {filter === 'completed' ? 'No completed tasks yet' : 'No tasks here'}
              </div>
              {filter === 'all' && (
                <div className={styles.emptySub}>Click "+ New Task" to get started</div>
              )}
            </div>
          )}

          {!loading && filtered.map((t) => (
            <TaskCard
              key={t.id}
              task={t}
              onToggle={toggle}
              onEdit={(task) => setModal(task)}
              onDelete={remove}
            />
          ))}
        </div>
      </main>

      {modal && (
        <TaskModal
          task={modal === 'new' ? null : (modal as Task)}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}

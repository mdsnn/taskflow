import { useState, useEffect, useCallback } from 'react';
import { FilterMode, Stats, Task, TaskPayload, TaskUpdatePayload } from '../types';
import * as tasksApi from '../api/tasks';

export function useTasks(token: string, filter: FilterMode) {
  const [tasks, setTasks]   = useState<Task[]>([]);
  const [stats, setStats]   = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);

  const reload = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [t, s] = await Promise.all([tasksApi.getTasks(filter), tasksApi.getStats()]);
      setTasks(t);
      setStats(s);
    } finally {
      setLoading(false);
    }
  }, [token, filter]);

  useEffect(() => { reload(); }, [reload]);

  const create = async (payload: TaskPayload)                     => { await tasksApi.createTask(payload);        reload(); };
  const update = async (id: string, payload: TaskUpdatePayload)  => { await tasksApi.updateTask(id, payload);   reload(); };
  const remove = async (id: string)                               => { await tasksApi.deleteTask(id);            reload(); };
  const toggle = (task: Task) => update(task.id, { completed: !task.completed });

  return { tasks, stats, loading, create, update, remove, toggle };
}

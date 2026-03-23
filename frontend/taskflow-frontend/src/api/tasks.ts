import { client } from './client';
import { FilterMode, Stats, Task, TaskPayload, TaskUpdatePayload } from '../types';

export const getTasks = async (filter: FilterMode): Promise<Task[]> => {
  const params = filter !== 'all' ? { filter } : {};
  const { data } = await client.get<Task[]>('/tasks', { params });
  return data;
};

export const getStats = async (): Promise<Stats> => {
  const { data } = await client.get<Stats>('/tasks/stats');
  return data;
};

export const createTask = async (payload: TaskPayload): Promise<Task> => {
  const { data } = await client.post<Task>('/tasks', payload);
  return data;
};

export const updateTask = async (id: string, payload: TaskUpdatePayload): Promise<Task> => {
  const { data } = await client.patch<Task>(`/tasks/${id}`, payload);
  return data;
};

export const deleteTask = async (id: string): Promise<void> => {
  await client.delete(`/tasks/${id}`);
};

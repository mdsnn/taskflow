export type Priority = 'high' | 'medium' | 'low';
export type FilterMode = 'all' | 'active' | 'completed';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  completed: boolean;
  created_at: string;
}

export interface TaskPayload {
  title: string;
  description?: string;
  priority?: Priority;
}

export interface TaskUpdatePayload {
  title?: string;
  description?: string;
  priority?: Priority;
  completed?: boolean;
}

export interface Stats {
  total: number;
  active: number;
  completed: number;
  completion_rate: number;
  by_priority: { high: number; medium: number; low: number };
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  username: string;
}

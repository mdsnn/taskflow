import axios from 'axios';
import { AuthResponse } from '../types';

export async function login(username: string, password: string): Promise<AuthResponse> {
  const form = new URLSearchParams({ username, password });
  const { data } = await axios.post<AuthResponse>('/auth/login', form, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
  return data;
}

export async function register(username: string, password: string): Promise<AuthResponse> {
  const { data } = await axios.post<AuthResponse>('/auth/register', { username, password });
  return data;
}

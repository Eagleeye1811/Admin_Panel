import api from './api';
import { User } from '../types/api.types';

export const getUsers = async (): Promise<User[]> => {
  const response = await api.get('/users');
  return response.data;
};

export const getUserById = async (id: string): Promise<User> => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

export const createUser = async (data: Partial<User>): Promise<User> => {
  const response = await api.post('/users', data);
  return response.data;
};

export const updateUserStatus = async (id: string, isActive: boolean): Promise<User> => {
  const response = await api.put(`/users/${id}/status`, { isActive });
  return response.data;
};

export const deleteUser = async (id: string): Promise<void> => {
  await api.delete(`/users/${id}`);
};
import api from './api';
import { DashboardStats } from '../types/api.types';

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const response = await api.get('/dashboard/stats');
  return response.data;
};
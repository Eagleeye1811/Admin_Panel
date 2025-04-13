import api from './api';
import { Story } from '../types/api.types';

export const getStories = async (): Promise<Story[]> => {
  const response = await api.get('/stories');
  return response.data;
};

export const getStoryById = async (id: string): Promise<Story> => {
  const response = await api.get(`/stories/${id}`);
  return response.data;
};

export const createStory = async (data: Partial<Story>): Promise<Story> => {
  const response = await api.post('/stories', data);
  return response.data;
};

export const updateStory = async (id: string, data: Partial<Story>): Promise<Story> => {
  const response = await api.put(`/stories/${id}`, data);
  return response.data;
};

export const deleteStory = async (id: string): Promise<void> => {
  await api.delete(`/stories/${id}`);
};
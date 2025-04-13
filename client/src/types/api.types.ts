export interface LoginResponse {
  token: string;
  user: {
    _id: string;
    email: string;
    role: string;
  };
}

export interface DashboardStats {
  totalStories: number;
  totalUsers: number;
  totalCategories: number;
  recentStories: Story[];
}

export interface Story {
  _id: string;
  title: string;
  description: string;
  audioUrl: string;
  category: Category;
  duration: number;
  plays: number;
  isActive: boolean;
  createdBy: User;
  createdAt: string;
}

export interface Category {
  _id: string;
  name: string;
  subcategories: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  _id: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  password?: string;
}


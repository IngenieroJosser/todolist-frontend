export interface SignUpData {
  name: string;
  email: string;
  password: string;
  age: number;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  id: string;
  name: string;
  email: string;
  password: string;
  age: number;
  // role: 'SELLER' | 'ADMIN' | 'BUYER';
}

export type Todo = {
  id: number;
  text: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  tags: string[];
};

export type Project = {
  id: number;
  name: string;
  color: string;
  taskCount: number;
};

export type User = {
  id: number;
  name: string;
  email: string;
  status: 'active' | 'inactive' | 'suspended';
  lastLogin: string;
  tasks: number;
  projects: number;
  role: 'admin' | 'user' | 'moderator';
};

export type SystemStats = {
  totalUsers: number;
  activeUsers: number;
  totalTasks: number;
  completedTasks: number;
  storageUsed: number;
  storageTotal: number;
  projects: number;
  teams: number;
};

export interface TaskData {
  nameTask: string;
  description: string;
  statusTask: string;
  priority: string;
  dueDate: Date;
  startDate?: Date;
  completedAt?: Date;
}

export interface TaskResponse {
  success: boolean;
  message: string;
  data?: never;
}
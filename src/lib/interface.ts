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
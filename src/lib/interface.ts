export interface SignUpData {
  name: string;
  email: string;
  password: string;
  age: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    password: string;
    age: string;
    // role: 'SELLER' | 'ADMIN' | 'BUYER';
  };
}
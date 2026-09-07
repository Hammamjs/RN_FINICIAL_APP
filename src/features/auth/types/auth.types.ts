export type Role = 'admin' | 'user' | 'super_admin';

export type User = {
  username: string;
  email: string;
  id: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
};

export type AuthResponse = {
  user: User;
  accessToken: string;
  refreshToken: string;
};

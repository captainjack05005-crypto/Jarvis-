import { create } from 'zustand';

interface User {
  id: string;
  username: string;
  email: string;
  full_name?: string;
  is_active: boolean;
  created_at: string;
}

interface AuthStore {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: localStorage.getItem('access_token'),
  isLoading: false,
  setUser: (user) => set({ user }),
  setToken: (token) => {
    if (token) {
      localStorage.setItem('access_token', token);
    } else {
      localStorage.removeItem('access_token');
    }
    set({ token });
  },
  setIsLoading: (isLoading) => set({ isLoading }),
  logout: () => {
    localStorage.removeItem('access_token');
    set({ user: null, token: null });
  },
}));

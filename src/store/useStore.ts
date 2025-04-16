import { create } from 'zustand';

interface StoreState {
  theme: 'light' | 'dark';
  isAuthenticated: boolean;
  user: {
    name: string;
    email: string;
  } | null;
  setTheme: (theme: 'light' | 'dark') => void;
  setUser: (user: { name: string; email: string } | null) => void;
  logout: () => void;
}

const useStore = create<StoreState>((set) => ({
  theme: 'light',
  isAuthenticated: false,
  user: null,
  
  setTheme: (theme) => set({ theme }),
  
  setUser: (user) => set({ 
    user,
    isAuthenticated: !!user 
  }),
  
  logout: () => set({ 
    user: null,
    isAuthenticated: false 
  }),
}));

export default useStore; 
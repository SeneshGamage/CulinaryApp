import { create } from 'zustand';

export type UserRole = 'user' | 'chef' | 'admin';

interface AppState {
  isAuthenticated: boolean;
  role: UserRole;
  chefApplicationStatus: 'none' | 'pending' | 'approved' | 'rejected';
  setAuthenticated: (value: boolean) => void;
  setRole: (role: UserRole) => void;
  setChefApplicationStatus: (status: AppState['chefApplicationStatus']) => void;
}

export const useAppStore = create<AppState>((set) => ({
  isAuthenticated: false,
  role: 'user',
  chefApplicationStatus: 'none',
  setAuthenticated: (value) => set({ isAuthenticated: value }),
  setRole: (role) => set({ role }),
  setChefApplicationStatus: (status) => set({ chefApplicationStatus: status }),
}));

import { create } from 'zustand';
import { Tip, TipCategory, Location } from '@/types';

interface TipState {
  tips: Tip[];
  selectedCategory: TipCategory | 'all';
  currentLocation: Location | null;
  isLoading: boolean;
  setTips: (tips: Tip[]) => void;
  addTip: (tip: Tip) => void;
  updateTip: (id: string, updates: Partial<Tip>) => void;
  setSelectedCategory: (category: TipCategory | 'all') => void;
  setCurrentLocation: (location: Location | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useTipStore = create<TipState>((set) => ({
  tips: [],
  selectedCategory: 'all',
  currentLocation: null,
  isLoading: false,
  setTips: (tips) => set({ tips }),
  addTip: (tip) => set((state) => ({ tips: [tip, ...state.tips] })),
  updateTip: (id, updates) => set((state) => ({
    tips: state.tips.map(tip => tip.id === id ? { ...tip, ...updates } : tip)
  })),
  setSelectedCategory: (selectedCategory) => set({ selectedCategory }),
  setCurrentLocation: (currentLocation) => set({ currentLocation }),
  setLoading: (isLoading) => set({ isLoading }),
}));
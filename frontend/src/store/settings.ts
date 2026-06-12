import { create } from 'zustand';

interface SettingsStore {
  theme: 'dark' | 'light';
  voiceEnabled: boolean;
  notificationsEnabled: boolean;
  autoSave: boolean;
  fontSize: 'small' | 'medium' | 'large';
  setTheme: (theme: 'dark' | 'light') => void;
  setVoiceEnabled: (enabled: boolean) => void;
  setNotificationsEnabled: (enabled: boolean) => void;
  setAutoSave: (enabled: boolean) => void;
  setFontSize: (size: 'small' | 'medium' | 'large') => void;
}

export const useSettingsStore = create<SettingsStore>((set) => ({
  theme: 'dark',
  voiceEnabled: true,
  notificationsEnabled: true,
  autoSave: true,
  fontSize: 'medium',
  setTheme: (theme) => set({ theme }),
  setVoiceEnabled: (enabled) => set({ voiceEnabled: enabled }),
  setNotificationsEnabled: (enabled) => set({ notificationsEnabled: enabled }),
  setAutoSave: (enabled) => set({ autoSave: enabled }),
  setFontSize: (size) => set({ fontSize: size }),
}));

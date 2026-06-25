import { create } from 'zustand';

const getSystemTheme = () =>
  window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

const stored = localStorage.getItem('theme');
const initialTheme = stored || getSystemTheme();

// Helper function jo attribute aur class dono ko pure DOM par sync karega
const syncThemeToDOM = (t) => {
  document.documentElement.setAttribute('data-theme', t);
  document.documentElement.classList.toggle('dark', t === 'dark');
};

const useThemeStore = create((set) => ({
  theme: initialTheme,

  toggleTheme: () =>
    set((s) => {
      const next = s.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', next);
      syncThemeToDOM(next);
      return { theme: next };
    }),

  setTheme: (theme) => {
    localStorage.setItem('theme', theme);
    syncThemeToDOM(theme);
    set({ theme });
  },
}));

// Apply on initial load
syncThemeToDOM(initialTheme);

export default useThemeStore;
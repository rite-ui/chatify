import { Sun, Moon } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import useThemeStore from '../../context/themeStore.js'; // Apne store ka sahi path dena

const ThemeToggle = () => {
  const { theme, toggleTheme } = useThemeStore() || {};
  const location = useLocation();

  // 📝 Yeh button SIRF in niche diye gaye paths par hi bahar float karega
  const outerPages = ['/login', '/register', '/forgot-password', '/forgotpassword', '/reset-password', '/verify-email'];
  
  // Check karega ki current URL inme se kisi se match ya start hota hai kya
  const isOuterPage = outerPages.some(path => location.pathname.startsWith(path));

  // Agar user main chat dashboard ("/") par hai, toh yeh bahar wala button gayab ho jayega
  if (!isOuterPage) return null;

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-4 right-4 z-50 p-2.5 rounded-xl bg-(--bg-card) border border-(--border) text-(--text-primary) shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer backdrop-blur-md flex items-center justify-center"
      title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      {theme === 'dark' ? (
        <Sun className="w-4.5 h-4.5 text-amber-500 fill-amber-500" />
      ) : (
        <Moon className="w-4.5 h-4.5 text-indigo-600 fill-indigo-100" />
      )}
    </button>
  );
};

export default ThemeToggle;
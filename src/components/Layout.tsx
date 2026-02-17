import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface LayoutProps {
  children: React.ReactNode;
}

export function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const [isDark, setIsDark] = React.useState(false);

  React.useEffect(() => {
    // Default to dark mode for DarkPixels theme
    setIsDark(true);
  }, []);

  React.useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <div className={cn("min-h-screen transition-colors duration-300", isDark ? "bg-slate-950 text-white" : "bg-gray-50 text-gray-900")}>
      <nav className="fixed top-0 w-full z-50 backdrop-blur-md bg-white/70 dark:bg-slate-950/70 border-b border-gray-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div 
              className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => navigate('/')}
            >
              <img src="/logodp.jpeg" alt="DarkPixels FinHealth" className="w-10 h-10 rounded-lg object-cover ring-2 ring-yellow-500/50" />
              <span className="text-xl font-bold bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600 bg-clip-text text-transparent">
                DarkPixels FinHealth
              </span>
            </div>
            
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600" />
              )}
            </button>
          </div>
        </div>
      </nav>
      
      <main className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {children}
      </main>
      <footer className="w-full py-6 mt-auto border-t border-gray-200 dark:border-slate-900 bg-white/70 dark:bg-slate-950/70 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Developed by <a href="https://darkpixels.in" target="_blank" rel="noopener noreferrer" className="font-semibold text-yellow-500 hover:text-yellow-400 hover:underline transition-colors">darkpixels</a>
            </p>
        </div>
      </footer>
    </div>
  );
};

'use client';

import { useTheme } from '@/contexts/theme-context';
import { Moon, Sun } from 'lucide-react';

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex flex-col gap-6 p-4">
      <header className="py-4">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Setări</h1>
      </header>

      <div className="flex flex-col gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="mb-4 text-sm font-bold text-primary">Aspect</h2>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">Mod Întunecat</p>
                <p className="text-sm text-slate-500">Activează tema întunecată</p>
              </div>
            </div>
            
            <label className="relative inline-flex cursor-pointer items-center">
              <input 
                type="checkbox" 
                className="peer sr-only" 
                checked={theme === 'dark'}
                onChange={toggleTheme}
              />
              <div className="peer h-6 w-11 rounded-full bg-slate-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:border-gray-600 dark:bg-slate-700"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useAuth } from '@/contexts/auth-context';
import { UserCircle, LogOut, Settings, Bell, CircleHelp } from 'lucide-react';
import Link from 'next/link';

export default function AccountPage() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col p-4 pb-20">
      <header className="py-4">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Contul Meu</h1>
      </header>

      {/* Profile Card */}
      <div className="mt-4 flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
          <UserCircle size={40} />
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            {user?.displayName || 'Utilizator'}
          </h2>
          <p className="text-sm text-slate-500">
            {user?.email || 'Niciun email asociat'}
          </p>
        </div>
      </div>

      {/* Menu Options */}
      <div className="mt-8 flex flex-col gap-3">
        <h3 className="px-2 text-sm font-bold text-slate-500">Preferințe</h3>
        
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <Link href="/settings" className="flex items-center gap-3 border-b border-slate-100 p-4 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50">
            <Settings className="text-slate-400" size={20} />
            <span className="flex-1 font-medium text-slate-700 dark:text-slate-200">Setări aplicație</span>
          </Link>
          
          <button className="flex w-full items-center gap-3 border-b border-slate-100 p-4 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50">
            <Bell className="text-slate-400" size={20} />
            <span className="flex-1 text-left font-medium text-slate-700 dark:text-slate-200">Notificări</span>
          </button>

          <button className="flex w-full items-center gap-3 p-4 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50">
            <CircleHelp className="text-slate-400" size={20} />
            <span className="flex-1 text-left font-medium text-slate-700 dark:text-slate-200">Ajutor & Suport</span>
          </button>
        </div>
      </div>

      {/* Logout */}
      <div className="mt-8">
        <button className="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50 p-4 font-bold text-red-600 transition-colors hover:bg-red-100 dark:border-red-900/30 dark:bg-red-900/10 dark:text-red-500 dark:hover:bg-red-900/20">
          <LogOut size={20} />
          <span>Deconectare</span>
        </button>
      </div>
    </div>
  );
}

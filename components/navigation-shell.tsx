"use client";

import Link from 'next/link';
import { Home, ShoppingCart, User, Settings } from 'lucide-react';
import { usePlatform } from '@/components/providers/platform-provider';
import { usePathname } from 'next/navigation';

export function NavigationShell() {
  const { isDesktop } = usePlatform();
  const pathname = usePathname();

  const navItems = [
    { href: '/', icon: Home, label: 'Acasă' },
    { href: '/shopping-list', icon: ShoppingCart, label: 'Lista' },
    { href: '/account', icon: User, label: 'Cont' },
    { href: '/settings', icon: Settings, label: 'Setări' },
  ];

  if (isDesktop) {
    return (
      <aside className="fixed left-0 top-0 bottom-0 w-64 border-r border-slate-200 bg-surface dark:border-slate-800 dark:bg-slate-950 z-50 py-8 px-4 flex flex-col">
        <div className="text-3xl font-bold text-primary mb-12 px-4 shadow-ambient">Froogo</div>
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-4 px-4 py-3 rounded-lg font-medium transition-colors ${
                  isActive
                    ? 'bg-primary-container text-on-primary-container'
                    : 'text-secondary hover:bg-surface-container-low hover:text-on-surface'
                }`}
              >
                <item.icon size={24} className={isActive ? 'text-primary' : ''} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    );
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-surface-bright/85 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/85">
      <div className="mx-auto flex h-16 max-w-md items-center justify-around px-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 ${
                isActive ? 'text-primary' : 'text-secondary hover:text-on-surface'
              }`}
            >
              <item.icon size={24} />
              <span className="text-[10px] font-medium">{item.label}</span>
              {isActive && <div className="h-1 w-1 rounded-full bg-primary mt-0.5" />}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

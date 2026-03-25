import { NavigationShell } from '@/components/navigation-shell';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50 lg:flex-row">
      <NavigationShell />
      <main className="flex-1 w-full min-w-0 overflow-x-hidden pb-16 lg:pb-0 lg:ml-64">
        {children}
      </main>
    </div>
  );
}

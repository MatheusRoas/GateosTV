import { Outlet } from 'react-router';
import Header from '@components/common/Header';
import BottomNav from '@components/common/BottomNav';
import ConnectionStatus from '@components/common/ConnectionStatus';

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-dark-950">
      <Header />
      <main className="flex-1 overflow-y-auto pb-20 pt-4">
        <div className="mx-auto max-w-7xl px-4">
          <Outlet />
        </div>
      </main>
      <BottomNav />
      <ConnectionStatus />
    </div>
  );
}

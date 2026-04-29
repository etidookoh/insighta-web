'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { clearTokens } from '@/lib/auth';
import { api } from '@/lib/api';

export default function Navbar({ username }: { username?: string }) {
  const router = useRouter();

  const handleLogout = async () => {
    const refreshToken = document.cookie.match(/refresh_token=([^;]+)/)?.[1];
    if (refreshToken) {
      await api.post('/auth/logout', { refresh_token: refreshToken }).catch(() => {});
    }
    clearTokens();
    router.push('/');
  };

  return (
    <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="text-white font-bold text-lg">Insighta+</Link>
          <div className="flex gap-6">
            <Link href="/dashboard" className="text-gray-400 hover:text-white text-sm transition-colors">Dashboard</Link>
            <Link href="/profiles" className="text-gray-400 hover:text-white text-sm transition-colors">Profiles</Link>
            <Link href="/search" className="text-gray-400 hover:text-white text-sm transition-colors">Search</Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {username && <Link href="/account" className="text-gray-400 hover:text-white text-sm">@{username}</Link>}
          <button onClick={handleLogout} className="text-gray-400 hover:text-red-400 text-sm transition-colors">Logout</button>
        </div>
      </div>
    </nav>
  );
}
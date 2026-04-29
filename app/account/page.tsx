'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { clearTokens } from '@/lib/auth';
import Navbar from '@/components/ui/Navbar';

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = document.cookie.match(/access_token=([^;]+)/)?.[1];
    if (!token) { router.push('/'); return; }
    api.defaults.headers['Authorization'] = `Bearer ${token}`;
    api.get('/auth/me').then(r => setUser(r.data.data)).catch(() => router.push('/'));
  }, [router]);

  const handleLogout = async () => {
    const refreshToken = document.cookie.match(/refresh_token=([^;]+)/)?.[1];
    if (refreshToken) {
      await api.post('/auth/logout', { refresh_token: refreshToken }).catch(() => {});
    }
    clearTokens();
    router.push('/');
  };

  if (!user) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full"/>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar username={user.username} />
      <main className="max-w-2xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-white mb-8">Account</h1>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">
          <div className="flex items-center gap-6 mb-8">
            {user.avatar_url && <img src={user.avatar_url} alt="avatar" className="w-16 h-16 rounded-full"/>}
            <div>
              <h2 className="text-xl font-bold text-white">@{user.username}</h2>
              <p className="text-gray-400 text-sm">{user.email}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Role</p>
              <p className="text-white font-medium capitalize">{user.role}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">User ID</p>
              <p className="text-white font-mono text-xs">{user.id}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl text-sm font-medium transition-colors">Sign out</button>
        </div>
      </main>
    </div>
  );
}
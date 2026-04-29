'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import Navbar from '@/components/ui/Navbar';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
  const token = document.cookie.match(/access_token=([^;]+)/)?.[1];
  const refreshToken = document.cookie.match(/refresh_token=([^;]+)/)?.[1];
  
  if (!token && !refreshToken) { router.push('/'); return; }

  const authHeader = token ? `Bearer ${token}` : null;
  if (authHeader) api.defaults.headers['Authorization'] = authHeader;

  Promise.all([
    api.get('/auth/me'),
    api.get('/api/profiles?limit=1'),
  ]).then(([userRes, profilesRes]) => {
    setUser(userRes.data.data);
    setStats(profilesRes.data);
  }).catch(async () => {
    // Try refresh
    if (refreshToken) {
      try {
        const res = await api.post('/auth/refresh', { refresh_token: refreshToken });
        const { access_token, refresh_token: newRefresh } = res.data;
        document.cookie = `access_token=${access_token}; path=/; max-age=150; SameSite=Strict`;
        document.cookie = `refresh_token=${newRefresh}; path=/; max-age=300; SameSite=Strict`;
        api.defaults.headers['Authorization'] = `Bearer ${access_token}`;
        const [userRes, profilesRes] = await Promise.all([
          api.get('/auth/me'),
          api.get('/api/profiles?limit=1'),
        ]);
        setUser(userRes.data.data);
        setStats(profilesRes.data);
      } catch {
        router.push('/');
      }
    } else {
      router.push('/');
    }
  });
}, [router]);

  if (!user) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full"/>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar username={user.username} />
      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Welcome back, @{user.username}</h1>
          <p className="text-gray-400 mt-1 text-sm">Role: <span className="text-blue-400 capitalize">{user.role}</span></p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <p className="text-gray-400 text-sm">Total Profiles</p>
            <p className="text-4xl font-bold text-white mt-2">{stats?.total ?? '—'}</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <p className="text-gray-400 text-sm">Total Pages</p>
            <p className="text-4xl font-bold text-white mt-2">{stats?.total_pages ?? '—'}</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <p className="text-gray-400 text-sm">Your Role</p>
            <p className="text-4xl font-bold text-white mt-2 capitalize">{user.role}</p>
          </div>
        </div>
        <div className="mt-8 flex gap-4">
          <button onClick={() => router.push('/profiles')} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl text-sm font-medium transition-colors">Browse Profiles</button>
          <button onClick={() => router.push('/search')} className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-xl text-sm font-medium transition-colors">Search</button>
        </div>
      </main>
    </div>
  );
}
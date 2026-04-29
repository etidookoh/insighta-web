'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import Navbar from '@/components/ui/Navbar';
import Link from 'next/link';

export default function ProfilesPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [meta, setMeta] = useState<any>({});
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({ gender: '', country_id: '', age_group: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = document.cookie.match(/access_token=([^;]+)/)?.[1];
    if (!token) { router.push('/'); return; }
    api.defaults.headers['Authorization'] = `Bearer ${token}`;
    api.get('/auth/me').then(r => setUser(r.data.data)).catch(() => router.push('/'));
  }, [router]);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    const token = document.cookie.match(/access_token=([^;]+)/)?.[1];
    if (token) api.defaults.headers['Authorization'] = `Bearer ${token}`;
    const params: any = { page, limit: 20 };
    if (filters.gender) params.gender = filters.gender;
    if (filters.country_id) params.country_id = filters.country_id;
    if (filters.age_group) params.age_group = filters.age_group;
    api.get('/api/profiles', { params }).then(r => {
      setProfiles(r.data.data);
      setMeta(r.data);
    }).catch(() => setProfiles([])).finally(() => setLoading(false));
  }, [user, page, filters]);

  const selectClass = "bg-gray-800 border border-gray-700 text-gray-300 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500";

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar username={user?.username} />
      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">Profiles</h1>
          <span className="text-gray-400 text-sm">{meta.total} total</span>
        </div>
        <div className="flex gap-3 mb-6 flex-wrap">
          <select className={selectClass} value={filters.gender} onChange={e => { setFilters(f => ({...f, gender: e.target.value})); setPage(1); }}>
            <option value="">All genders</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          <select className={selectClass} value={filters.age_group} onChange={e => { setFilters(f => ({...f, age_group: e.target.value})); setPage(1); }}>
            <option value="">All age groups</option>
            <option value="child">Child</option>
            <option value="teenager">Teenager</option>
            <option value="young adult">Young Adult</option>
            <option value="adult">Adult</option>
            <option value="senior">Senior</option>
          </select>
          <input placeholder="Country code e.g. NG" className={selectClass} value={filters.country_id}
            onChange={e => { setFilters(f => ({...f, country_id: e.target.value})); setPage(1); }} />
        </div>
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full"/>
          </div>
        ) : (
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800">
                  {['Name','Gender','Age','Age Group','Country','Created'].map(h => (
                    <th key={h} className="text-left text-gray-400 font-medium px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {profiles.map(p => (
                  <tr key={p.id} className="border-b border-gray-800 hover:bg-gray-800 transition-colors">
                    <td className="px-4 py-3">
                      <Link href={`/profiles/${p.id}`} className="text-blue-400 hover:text-blue-300">{p.name}</Link>
                    </td>
                    <td className="px-4 py-3 text-gray-300 capitalize">{p.gender}</td>
                    <td className="px-4 py-3 text-gray-300">{p.age}</td>
                    <td className="px-4 py-3 text-gray-300 capitalize">{p.age_group}</td>
                    <td className="px-4 py-3 text-gray-300">{p.country_id}</td>
                    <td className="px-4 py-3 text-gray-400">{new Date(p.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="flex items-center justify-between mt-6">
          <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="bg-gray-800 disabled:opacity-40 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-700 transition-colors">Previous</button>
          <span className="text-gray-400 text-sm">Page {meta.page} of {meta.total_pages}</span>
          <button disabled={page >= meta.total_pages} onClick={() => setPage(p => p + 1)} className="bg-gray-800 disabled:opacity-40 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-700 transition-colors">Next</button>
        </div>
      </main>
    </div>
  );
}
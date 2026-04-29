'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import Navbar from '@/components/ui/Navbar';
import Link from 'next/link';

export default function SearchPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [meta, setMeta] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    const token = document.cookie.match(/access_token=([^;]+)/)?.[1];
    if (!token) { router.push('/'); return; }
    api.defaults.headers['Authorization'] = `Bearer ${token}`;
    api.get('/auth/me').then(r => setUser(r.data.data)).catch(() => router.push('/'));
  }, [router]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const res = await api.get('/api/profiles/search', { params: { q: query } });
      setResults(res.data.data);
      setMeta(res.data);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar username={user?.username} />
      <main className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-white mb-6">Natural Language Search</h1>
        <form onSubmit={handleSearch} className="flex gap-3 mb-8">
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder='e.g. "young females from Nigeria"'
            className="flex-1 bg-gray-900 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
          />
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl text-sm font-medium transition-colors">Search</button>
        </form>

        {loading && <div className="flex justify-center py-10"><div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full"/></div>}

        {!loading && searched && (
          <>
            <p className="text-gray-400 text-sm mb-4">{meta.total} results found</p>
            <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-800">
                    {['Name','Gender','Age','Country'].map(h => (
                      <th key={h} className="text-left text-gray-400 font-medium px-4 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {results.map(p => (
                    <tr key={p.id} className="border-b border-gray-800 hover:bg-gray-800 transition-colors">
                      <td className="px-4 py-3"><Link href={`/profiles/${p.id}`} className="text-blue-400 hover:text-blue-300">{p.name}</Link></td>
                      <td className="px-4 py-3 text-gray-300 capitalize">{p.gender}</td>
                      <td className="px-4 py-3 text-gray-300">{p.age}</td>
                      <td className="px-4 py-3 text-gray-300">{p.country_id}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
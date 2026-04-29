'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { api } from '@/lib/api';
import Navbar from '@/components/ui/Navbar';
import Link from 'next/link';

export default function ProfileDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const token = document.cookie.match(/access_token=([^;]+)/)?.[1];
    if (!token) { router.push('/'); return; }
    api.defaults.headers['Authorization'] = `Bearer ${token}`;
    Promise.all([
      api.get('/auth/me'),
      api.get(`/api/profiles/${id}`),
    ]).then(([userRes, profileRes]) => {
      setUser(userRes.data.data);
      setProfile(profileRes.data.data);
    }).catch(() => router.push('/profiles'));
  }, [router, id]);

  if (!profile) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full"/>
    </div>
  );

  const fields = [
    { label: 'Gender', value: `${profile.gender} (${(profile.gender_probability * 100).toFixed(0)}%)` },
    { label: 'Age', value: profile.age },
    { label: 'Age Group', value: profile.age_group },
    { label: 'Country', value: `${profile.country_name} (${profile.country_id})` },
    { label: 'Country Probability', value: `${(profile.country_probability * 100).toFixed(0)}%` },
    { label: 'Created', value: new Date(profile.created_at).toLocaleString() },
  ];

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar username={user?.username} />
      <main className="max-w-3xl mx-auto px-6 py-10">
        <Link href="/profiles" className="text-gray-400 hover:text-white text-sm mb-6 inline-block">← Back to profiles</Link>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">
          <h1 className="text-3xl font-bold text-white mb-8">{profile.name}</h1>
          <div className="grid grid-cols-2 gap-6">
            {fields.map(f => (
              <div key={f.label}>
                <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">{f.label}</p>
                <p className="text-white font-medium capitalize">{f.value}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
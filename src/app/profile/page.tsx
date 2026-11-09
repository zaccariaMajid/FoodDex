'use client';
import {useEffect,useState} from 'react';import Link from 'next/link';import {Shell} from '@/components/shell';import {createClient} from '@/lib/supabase/client';import {useAuth} from '@/lib/use-auth';
export default function Profile(){
 const {user,loading}=useAuth();const [counts,setCounts]=useState({dishes:0,medals:0});
 useEffect(()=>{if(!user)return;const db=createClient();if(!db)return;Promise.all([db.from('user_discoveries').select('*',{count:'exact',head:true}),db.from('user_medals').select('*',{count:'exact',head:true})]).then(([d,m])=>setCounts({dishes:d.count??0,medals:m.count??0}));},[user]);
 if(loading)return <Shell>Caricamento…</Shell>;
 if(!user)return <Shell><Link href="/login">Accedi per vedere il profilo.</Link></Shell>;
 return <Shell><h1 className="text-3xl font-bold">Profilo</h1><p className="mt-2 text-gray-500">{user.email}</p><div className="mt-6 grid grid-cols-2 gap-4"><div className="rounded-xl bg-gray-100 p-5">Piatti scoperti<strong className="block text-3xl">{counts.dishes}</strong></div><div className="rounded-xl bg-gray-100 p-5">Medaglie<strong className="block text-3xl">{counts.medals}</strong></div></div>
 <button className="mt-8 rounded-xl border p-3" onClick={async()=>{await createClient()?.auth.signOut();window.location.href='/FoodDex/';}}>Esci</button></Shell>;
}

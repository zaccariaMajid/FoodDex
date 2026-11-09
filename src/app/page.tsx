'use client';
import {useEffect,useState} from 'react';
import Link from 'next/link';
import {Shell} from '@/components/shell';
import {createClient} from '@/lib/supabase/client';
import {useAuth} from '@/lib/use-auth';
type Country={code:string;name_it:string;name_en:string;flag:string;sort_order:number};
export default function Home(){
 const {user,loading}=useAuth();
 const [countries,setCountries]=useState<Country[]>([]);
 const [error,setError]=useState('');
 useEffect(()=>{if(!user)return;let active=true;const db=createClient();if(!db){setError('Configura NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY per collegare Supabase.');return;}
 db.from('countries').select('code,name_it,name_en,flag,sort_order').order('sort_order').then(({data,error})=>{if(active){setCountries(data??[]);if(error)setError(error.message);}});return()=>{active=false;};},[user]);
 if(loading)return <Shell><p>Caricamento…</p></Shell>;
 if(!user)return <Shell><h1 className="text-3xl font-bold">Benvenuto in FoodDex</h1><p className="mt-3">Accedi per esplorare i piatti misteriosi.</p><Link className="mt-5 inline-block rounded-xl bg-[#234e46] px-6 py-3 text-white" href="/login">Accedi o registrati</Link></Shell>;
 return <Shell><h1 className="text-3xl font-bold">Esplora il mondo</h1><p className="mt-1 text-gray-500">Un piatto alla volta.</p>
 <div className="my-6 rounded-2xl bg-[#f4f7f4] p-5"><strong>La tua collezione</strong><p className="mt-2 text-sm text-gray-500">I progressi globali saranno attivati con il catalogo completo.</p></div>
 {error&&<p role="alert" className="mb-4 rounded-xl bg-amber-50 p-3 text-sm">{error}</p>}
 <div className="grid grid-cols-2 gap-3">{countries.map(c=><Link className="rounded-2xl border border-gray-200 p-5" key={c.code} href={'/countries/'+c.code}><span className="text-4xl">{c.flag}</span><h2 className="mt-4 font-semibold">{c.name_it}</h2><p className="text-sm text-gray-500">5 piatti da scoprire</p></Link>)}</div></Shell>;
}

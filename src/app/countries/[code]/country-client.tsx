'use client';
import {useParams} from 'next/navigation';
import Link from 'next/link';
import {useEffect,useState} from 'react';
import {Shell} from '@/components/shell';
import {createClient} from '@/lib/supabase/client';
import {useAuth} from '@/lib/use-auth';
type Slot={slot_number:number;is_unlocked:boolean;display_name:string|null};
export default function CountryClient(){
 const {code}=useParams<{code:string}>();const {user,loading}=useAuth();
 const [country,setCountry]=useState<{name_it:string;flag:string}|null>(null);const [slots,setSlots]=useState<Slot[]>([]);
 useEffect(()=>{if(!user)return;const db=createClient();if(!db)return;let active=true;
 Promise.all([db.from('countries').select('name_it,flag').eq('code',code).maybeSingle(),db.rpc('get_country_slots',{p_country:code})]).then(([c,s])=>{if(active){setCountry(c.data);setSlots(s.data??[]);}});
 return()=>{active=false};},[user,code]);
 if(loading)return <Shell>Caricamento…</Shell>;
 if(!user)return <Shell><Link href="/login">Accedi per vedere i piatti misteriosi.</Link></Shell>;
 return <Shell><Link href="/" className="text-sm text-[#234e46]">← Tutti i paesi</Link><h1 className="my-5 text-3xl font-bold">{country?.flag} {country?.name_it??code}</h1>
 <div className="grid grid-cols-2 gap-3">{slots.map(s=><Link key={s.slot_number} href={'/countries/'+code+'/dishes/'+s.slot_number} className="rounded-xl bg-[#f5f7f5] p-6 text-center"><span className="text-4xl">{s.is_unlocked?'🍽':'🔒'}</span><p className="mt-3 font-semibold">#{String(s.slot_number).padStart(3,'0')} {s.display_name??'???'}</p></Link>)}</div>
 {slots.length===0&&<p className="mt-4 text-sm text-gray-500">Nessun piatto disponibile: il catalogo deve ancora essere importato.</p>}</Shell>;
}

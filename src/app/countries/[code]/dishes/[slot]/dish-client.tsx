'use client';
import {useParams} from 'next/navigation';import {useEffect,useState} from 'react';import Link from 'next/link';
import {Shell} from '@/components/shell';import {createClient} from '@/lib/supabase/client';import {useAuth} from '@/lib/use-auth';
type Dish={is_unlocked:boolean;display_name:string|null;description:string|null;hints:(string|null)[];revealed_hints:number};
export default function DishClient(){
 const {code,slot}=useParams<{code:string;slot:string}>();const {user,loading}=useAuth();const [dish,setDish]=useState<Dish|null>(null);const [busy,setBusy]=useState(false);const [error,setError]=useState('');
 async function refresh(){const db=createClient();if(!db)return;const {data,error}=await db.rpc('get_dish_slot',{p_country:code,p_slot:Number(slot)});if(error)setError(error.message);setDish(data?.[0]??null);}
 useEffect(()=>{if(user)void refresh();},[user,code,slot]);
 async function reveal(){const db=createClient();if(!db)return;setBusy(true);const {error}=await db.rpc('reveal_hint',{p_country:code,p_slot:Number(slot)});if(error)setError(error.message);await refresh();setBusy(false);}
 if(loading)return <Shell>Caricamento…</Shell>;
 if(!user)return <Shell><Link href="/login">Accedi per consultare gli indizi.</Link></Shell>;
 return <Shell><Link className="text-sm text-[#234e46]" href={'/countries/'+code}>← Torna al paese</Link>
 <div className="my-6 rounded-2xl bg-[#f5f7f5] p-14 text-center"><div className="text-5xl">{dish?.is_unlocked?'🍽':'🔒'}</div><h1 className="mt-4 text-2xl font-bold">{dish?.display_name??'???'}</h1></div>
 {error&&<p role="alert" className="my-3 text-red-700">{error}</p>}
 {dish?.is_unlocked?<p>{dish.description}</p>:<><h2 className="mb-3 font-semibold">Indizi</h2>{[0,1,2].map(i=><div key={i} className="mb-3 rounded-xl bg-gray-50 p-4"><strong>Indizio {i+1}</strong><p className="text-sm text-gray-600">{dish?.hints?.[i]??'🔒 Ancora nascosto'}</p></div>)}<button disabled={!dish||busy||dish.revealed_hints>=3} className="rounded-xl bg-[#234e46] px-5 py-3 text-white disabled:opacity-50" onClick={reveal}>Rivela il prossimo indizio</button></>}
 </Shell>;
}

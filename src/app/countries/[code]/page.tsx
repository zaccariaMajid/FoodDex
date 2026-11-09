import Link from 'next/link';import {notFound} from 'next/navigation';import {Shell} from '@/components/shell';import {createClient} from '@/lib/supabase/server';
export default async function Country({params}:{params:Promise<{code:string}>}){
 const {code}=await params;const db=await createClient();const {data:c}=await db.from('countries').select('name_it,flag').eq('code',code.toUpperCase()).maybeSingle();if(!c)notFound();
 const {data:slots}=await db.rpc('get_country_slots',{p_country:code.toUpperCase()});
 return <Shell><Link href="/" className="text-sm text-[#234e46]">← Tutti i paesi</Link><h1 className="my-5 text-3xl font-bold">{c.flag} {c.name_it}</h1>
 <div className="grid grid-cols-2 gap-3">{(slots??[]).map((s:{slot_number:number;is_unlocked:boolean;display_name:string|null})=><Link key={s.slot_number} href={'/countries/'+code+'/dishes/'+s.slot_number} className="rounded-xl bg-[#f5f7f5] p-6 text-center"><span className="text-4xl">{s.is_unlocked?'🍜':'🔒'}</span><p className="mt-3 font-semibold">#{String(s.slot_number).padStart(3,'0')} {s.display_name??'???'}</p></Link>)}</div>
 </Shell>;
}

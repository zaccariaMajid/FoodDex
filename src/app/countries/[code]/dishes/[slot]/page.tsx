import Link from 'next/link';import {notFound} from 'next/navigation';import {Shell} from '@/components/shell';import {createClient} from '@/lib/supabase/server';
export default async function Dish({params}:{params:Promise<{code:string;slot:string}>}){
 const {code,slot}=await params;const num=Number(slot);if(!Number.isInteger(num)||num<1||num>5)notFound();
 const db=await createClient();const {data:rows}=await db.rpc('get_dish_slot',{p_country:code.toUpperCase(),p_slot:num});const dish=rows?.[0];if(!dish)notFound();
 return <Shell><Link className="text-sm text-[#234e46]" href={'/countries/'+code}>← Torna al paese</Link>
 <div className="my-6 rounded-2xl bg-[#f5f7f5] p-14 text-center"><div className="text-5xl">{dish.is_unlocked?'🍽':'🔒'}</div><h1 className="mt-4 text-2xl font-bold">{dish.display_name??'???'}</h1></div>
 {dish.is_unlocked?<p>{dish.description}</p>:<><h2 className="mb-3 font-semibold">Indizi</h2>{(dish.hints??[]).map((h:string|null,i:number)=><div key={i} className="mb-3 rounded-xl bg-gray-50 p-4"><strong>Indizio {i+1}</strong><p className="text-sm text-gray-600">{h??'🔒 Ancora nascosto'}</p></div>)}<p className="text-sm text-gray-500">Lo sblocco degli indizi sarà aggiunto nel prossimo step.</p></>}
 </Shell>;
}

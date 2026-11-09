import Link from 'next/link';
import {Shell} from '@/components/shell';
import {createClient} from '@/lib/supabase/server';
type Country={code:string;name_it:string;name_en:string;flag:string;sort_order:number};
export default async function Home(){
 const ready=Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL&&process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
 let countries:Country[]=[];
 if(ready){const db=await createClient();const {data}=await db.from('countries').select('code,name_it,name_en,flag,sort_order').order('sort_order');countries=data??[];}
 return <Shell><h1 className="text-3xl font-bold">Esplora il mondo</h1><p className="mt-1 text-gray-500">Un piatto alla volta.</p>
 <div className="my-6 rounded-2xl bg-[#f4f7f4] p-5"><div className="flex justify-between"><strong>La tua collezione</strong><span>0 / 50</span></div><div className="mt-3 h-2 rounded-full bg-gray-200"/></div>
 {!ready&&<p className="mb-4 rounded-xl bg-amber-50 p-3 text-sm">Configura Supabase in .env.local per caricare i paesi.</p>}
 <div className="grid grid-cols-2 gap-3">{countries.map(c=><Link className="rounded-2xl border border-gray-200 p-5" key={c.code} href={'/countries/'+c.code}><span className="text-4xl">{c.flag}</span><h2 className="mt-4 font-semibold">{c.name_it}</h2><p className="text-sm text-gray-500">5 piatti da scoprire</p></Link>)}</div></Shell>;
}

'use client';
import {useState} from 'react';
import {createClient} from '@/lib/supabase/client';
export default function Login(){
 const [email,setEmail]=useState('');const [password,setPassword]=useState('');const [mode,setMode]=useState<'login'|'signup'>('login');const [message,setMessage]=useState('');
 async function submit(e:React.FormEvent){e.preventDefault();setMessage('');const db=createClient();if(!db){setMessage('Configurazione Supabase mancante.');return;}
 const result=mode==='login'?await db.auth.signInWithPassword({email,password}):await db.auth.signUp({email,password,options:{emailRedirectTo:window.location.origin+'/FoodDex/'}});
 if(result.error){setMessage(result.error.message);return;}if(mode==='signup'){setMessage('Controlla la tua email per confermare la registrazione.');return;}window.location.href=process.env.NEXT_PUBLIC_BASE_PATH||'/FoodDex/';}
 return <main className="mx-auto max-w-sm p-8"><h1 className="mb-3 text-3xl font-bold text-[#234e46]">FoodDex</h1><p className="mb-6">{mode==='login'?'Accedi alla tua collezione':'Crea un account'}</p>
 <form className="space-y-4" onSubmit={submit}><label className="block">Email<input type="email" required className="mt-1 w-full rounded-lg border p-3" value={email} onChange={e=>setEmail(e.target.value)}/></label>
 <label className="block">Password<input type="password" minLength={6} required className="mt-1 w-full rounded-lg border p-3" value={password} onChange={e=>setPassword(e.target.value)}/></label>
 <button className="w-full rounded-xl bg-[#234e46] p-3 text-white">{mode==='login'?'Accedi':'Registrati'}</button></form>
 <button className="mt-5 text-sm underline" onClick={()=>setMode(mode==='login'?'signup':'login')}>{mode==='login'?'Crea un account':'Hai già un account?'}</button><p aria-live="polite" className="mt-4 text-sm">{message}</p></main>;
}

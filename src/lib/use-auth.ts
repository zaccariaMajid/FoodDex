'use client';
import {useEffect,useState} from 'react';
import type {User} from '@supabase/supabase-js';
import {createClient} from '@/lib/supabase/client';
export function useAuth(){
 const [user,setUser]=useState<User|null>(null);
 const [loading,setLoading]=useState(true);
 useEffect(()=>{
 const db=createClient();
 if(!db){setLoading(false);return;}
 let mounted=true;
 db.auth.getUser().then(({data})=>{if(mounted){setUser(data.user);setLoading(false);}}).catch(()=>{if(mounted)setLoading(false);});
 const {data:{subscription}}=db.auth.onAuthStateChange((_event,session)=>{if(mounted){setUser(session?.user??null);setLoading(false);}});
 return ()=>{mounted=false;subscription.unsubscribe();};
 },[]);
 return {user,loading};
}

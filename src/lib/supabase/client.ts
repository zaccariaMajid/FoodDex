import {createClient as makeClient, type SupabaseClient} from '@supabase/supabase-js';
let cached:SupabaseClient | null = null;
export function createClient():SupabaseClient | null{
 const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
 const key=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
 if(!url || !key)return null;
 if(!cached) cached=makeClient(url,key,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
 return cached;
}

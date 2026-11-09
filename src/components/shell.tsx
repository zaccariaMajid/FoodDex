import Link from 'next/link';
export function Shell({children}:{children:React.ReactNode}){
 return <div className="mx-auto min-h-screen max-w-3xl bg-white shadow-sm">
 <header className="flex items-center justify-between border-b border-gray-100 px-5 py-5"><Link href="/" className="text-2xl font-bold text-[#234e46]">🍽 FoodDex</Link><Link className="text-sm text-gray-600" href="/login">Account</Link></header>
 <main className="px-5 py-7 pb-28">{children}</main>
 <nav className="fixed bottom-0 left-1/2 flex w-full max-w-3xl -translate-x-1/2 justify-around border-t border-gray-200 bg-white px-3 py-4 text-sm">
 <Link href="/">🌍 Pokédex</Link><Link href="/scan">📷 Scansiona</Link><Link href="/profile">👤 Profilo</Link></nav></div>;
}

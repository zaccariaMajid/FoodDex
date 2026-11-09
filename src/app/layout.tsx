import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {title:'FoodDex',description:'Esplora il mondo, un piatto alla volta.',applicationName:'FoodDex'};
export default function RootLayout({children}:{children:React.ReactNode}) {
 return <html lang="it"><body>{children}</body></html>;
}

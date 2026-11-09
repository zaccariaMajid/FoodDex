import CountryClient from './country-client';
export function generateStaticParams(){return ['IT','JP','MX','FR','IN','TH','CN','TR','MA','BR'].map(code=>({code}));}
export default function Country(){return <CountryClient/>;}

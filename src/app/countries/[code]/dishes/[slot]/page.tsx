import DishClient from './dish-client';
const codes=['IT','JP','MX','FR','IN','TH','CN','TR','MA','BR'];
export function generateStaticParams(){return codes.flatMap(code=>[1,2,3,4,5].map(slot=>({code,slot:String(slot)})));}
export default function Dish(){return <DishClient/>;}

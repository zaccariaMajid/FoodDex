import type { MetadataRoute } from 'next';
export default function manifest(): MetadataRoute.Manifest {
 return {name:'FoodDex',short_name:'FoodDex',description:'Il Pokédex culinario',start_url:'/',display:'standalone',background_color:'#f7f8f6',theme_color:'#234e46',icons:[{src:'/icon.svg',sizes:'any',type:'image/svg+xml',purpose:'any'}]};
}

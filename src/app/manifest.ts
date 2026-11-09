import type {MetadataRoute} from 'next';
export default function manifest():MetadataRoute.Manifest {
 const prefix=process.env.GITHUB_PAGES==='true'?'/FoodDex':'';
 return {name:'FoodDex',short_name:'FoodDex',description:'Il Pokédex culinario',start_url:prefix+'/',scope:prefix+'/',display:'standalone',background_color:'#f7f8f6',theme_color:'#234e46',icons:[{src:prefix+'/icon.svg',sizes:'any',type:'image/svg+xml',purpose:'any'}]};
}

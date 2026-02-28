import { useEffect, useState } from 'react'
import axios from 'axios'
import MovingImage from '../Components/MovingImages';
import type { Hero, ImgInfo, RivalsMap  } from '../types/types';
import LoadingScreen from '../Components/LoadingScreen';


const Home = () => {
    const [heros, setHeros] = useState<Hero[]>([]);
    const [maps, setMaps] = useState<RivalsMap[]>([])
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    // What is <T,> -> This function works with ANY type, T is a generic placeholder type.
    // <T[]> -> data is an array of whatever T is. If T = Hero → arr is Hero[]
    const getInfo = async <T,>(url:string, listKey?: string)=> {
      try {
    
        const config = {
          method: "get",
          url: url,
          headers: {
            "x-api-key": import.meta.env.VITE_MARVEL_KEY as string,
          },
        };
        const { data } = await axios<T[]>(config);
    
        // If API returns an array directly
        if (Array.isArray(data)) return data as T[];
    
        // If API returns { maps: [...] } or { heroes: [...] } etc.
        if (listKey && Array.isArray(data?.[listKey])) return data[listKey] as T[];
    
        // Fallback
        return []
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Unknown error");
        return [];
      } 
    }
    
    // getId: (item: T) => string | number -> This is a function parameter. We need it because Because Hero and RivalsMap don’t have the same structure. Example, RivalsMap return a integer ID, Hero returns string ID
    const getImages = <T,>(
      arr: T[],
      getId: (item: T) => string | number,
      getName: (item: T) => string,
      getImage: (item: T) => string
    ): ImgInfo[] => {
      if (!Array.isArray(arr)) return []
      return arr.map((item) => ({
        id: String(getId(item)),
        name: getName(item),
        image: getImage(item),
      }));
    }
    
    useEffect(() => {
        const run = async () => {
            setLoading(true);
            setError(null);
        
            const heroes = await getInfo<Hero>("https://marvelrivalsapi.com/api/v1/heroes");
            const getMaps = await getInfo<RivalsMap>("https://marvelrivalsapi.com/api/v1/maps?page=1&limit=12", "maps")
        
            setHeros(heroes);
            setMaps(getMaps)
            setLoading(false);
        };
        
        // void means you can call async function and ignore whatever it returns / prevents warnings
        void run();
    }, []);
    
    const heroImages = getImages(
      heros,
      (h) => h.id,
      (h)=> h.name,
      (h) => h.imageUrl
    )
    
    const mapImages = getImages(
      maps,
      (m) => m.id,
      (m) => m.name,
      (m) => m.images[2] 
    )
    
    if (loading) return <LoadingScreen />;
    if (error) return <h2>{error}</h2>;

    return (
        <>
          <MovingImage imgs={heroImages} />
          <MovingImage imgs={mapImages} />
        </>
      );
}

export default Home
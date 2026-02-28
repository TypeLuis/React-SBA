import { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios'
import MovingImage from './Components/MovingImages';
import type { Hero, ImgInfo, RivalsMap  } from './types/types';


function App() {
  const [heros, setHeros] = useState<Hero[]>([]);
  const [maps, setMaps] = useState<RivalsMap[]>([])
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getInfo = async <T,>(url:string)=> {
    try {
      setLoading(true);
      setError(null);
      const config = {
        method: "get",
        url: url,
        headers: {
          "x-api-key": import.meta.env.VITE_MARVEL_KEY as string,
        },
      };
      const { data } = await axios<T[]>(config);
      console.log(data)
      return data
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Unknown error");
      return [];
    } finally {
      setLoading(false);
    }
  }
  
  // const getChars = async () => {
  //   try {
  //     setLoading(true);
  //     setError(null);
  //     const config = {
  //       method: "get",
  //       url: "https://marvelrivalsapi.com/api/v1/heroes",
  //       headers: {
  //         "x-api-key": import.meta.env.VITE_MARVEL_KEY as string,
  //       },
  //     };
  //     const { data } = await axios<Hero[]>(config);
  //     console.log(data)
  //     setHeros(data)
  //   } catch (e: unknown) {
  //     setError(e instanceof Error ? e.message : "Unknown error");
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  
  // const getMaps = async () => {
  //   try {
  //     const config = {
  //       method: 'get',
  //       url: 'https://marvelrivalsapi.com/api/v1/maps',
  //       headers: { 
  //         'x-api-key': import.meta.env.VITE_MARVEL_KEY as string
  //       }
  //     };
  //     const { data } = await axios(config);
  //     console.log(data)
  //   } catch (e: unknown) {
  //     setError(e instanceof Error ? e.message : "Unknown error");
  //   }
  // }

  const getImages = <T,>(
    arr: T[],
    getId: (item: T) => string | number,
    getName: (item: T) => string,
    getImage: (item: T) => string
  ): ImgInfo[] => {
    return arr.map((item) => ({
      id: String(getId(item)),
      name: getName(item),
      image: getImage(item),
    }));
  }
  
  const heroImages = () => {
    const data: ImgInfo[] = heros.map((h) => ({
      id: h.id,
      name: h.name,
      image: h.imageUrl,
    }));
    return data
  }

  useEffect(() => {
    const run = async () => {
      const heroes = await getInfo<Hero>("https://marvelrivalsapi.com/api/v1/heroes");
      const getMaps = await getInfo<RivalsMap>("https://marvelrivalsapi.com/api/v1/maps")
      setHeros(heroes);
      setMaps(getMaps)
    };

    // void means you can call async function and ignore whatever it returns / prevents warnings
    void run();
  }, []);

  if (loading) return <h2>Loading…</h2>;
  if (error) return <h2>{error}</h2>;

  return (
    <>
      <div style={{ fontSize: "500px" }}>hi</div>
      <MovingImage imgs={heroImages()} />
      <div></div>
    </>
  );
}

export default App
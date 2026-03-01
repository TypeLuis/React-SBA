import { useEffect, useState } from 'react'
import Home from './pages/Home';
import Nav from './Components/Nav';
import axios from 'axios';
import { Route, Routes } from "react-router-dom";
import type { Hero, RivalsMap } from './types/types';
import LoadingScreen from './Components/LoadingScreen';
import Heros from './pages/Heros';
import Maps from './pages/Maps';
import Players from './pages/Players';

function App() {
  const [heros, setHeros] = useState<Hero[]>([]);
  const [maps, setMaps] = useState<RivalsMap[]>([])
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  // What is <T,> -> This function works with ANY type, T is a generic placeholder type.
  // <T[]> -> data is an array of whatever T is. If T = Hero → arr is Hero[]
  const getInfo = async <T,>(url: string, listKey?: string) => {
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

  if (loading) return <LoadingScreen />;
  if (error) return <h2>{error}</h2>;

  return (
    <>
      <Nav />
      <Routes>
        <Route path="/" element={<Home heros={heros} rivalMaps={maps} />} />
        <Route path="/heroes" element={<Heros heros={heros}/>}/>
        <Route path="/maps" element={<Maps rivalMaps={maps} />}/>
        <Route path="/players" element={<Players/>}/>
      </Routes>
    </>
  );
}

export default App
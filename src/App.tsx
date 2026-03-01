import { useEffect, useState } from 'react'
import Home from './pages/Home';
import Nav from './Components/Nav';
import { Route, Routes } from "react-router-dom";
import type { Hero, RivalsMap } from './types/types';
import LoadingScreen from './Components/LoadingScreen';
import Heros from './pages/Heros';
import Maps from './pages/Maps';
import Players from './pages/Players';
import './App.scss'
import DetailsPage from './pages/DetailsPage';
import { getInfo } from './utilities/functions';

function App() {
  const [heros, setHeros] = useState<Hero[]>([]);
  const [maps, setMaps] = useState<RivalsMap[]>([])
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setError(null);

      const heroes = await getInfo<Hero>("https://marvelrivalsapi.com/api/v1/heroes", setError);
      const getMaps = await getInfo<RivalsMap>("https://marvelrivalsapi.com/api/v1/maps?page=1&limit=50", setError, "maps")

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
      <div className='layout'>
        <Routes>
          <Route path="/" element={<Home heros={heros} rivalMaps={maps} />} />
          <Route path="/heroes" element={<Heros heros={heros}/>}/>
          <Route path="/maps" element={<Maps rivalMaps={maps} />}/>
          <Route path="/players" element={<Players/>}/>
          <Route path="/heroes/:id" element={<DetailsPage />} />
          <Route path="/maps/:id" element={<DetailsPage />} />
          <Route path="/players/:id" element={<DetailsPage />} />
        </Routes>
      </div>
    </>
  );
}

export default App
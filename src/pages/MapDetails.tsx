import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { getOne } from '../utilities/functions';
import LoadingScreen from '../Components/LoadingScreen';
import MapDetail from '../Components/MapDetail';
import HeroDetail from '../Components/HeroDetail';
import PlayerDetail from '../Components/PlayerDetail';
import type {  HeroObj, RivalsMap } from '../types/types';

type MapDetailsProps = {

}

type Data = HeroObj | RivalsMap


const MapDetails = ({ }: MapDetailsProps) => {
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(true);
    const [info, setInfo] = useState<Data | null>(null)

    const {id} = useParams()
    const location = useLocation();
    
    const segments = location.pathname.split("/").filter(Boolean);

    const isMap = segments[0] === "maps";
    const isHero = segments[0] === "heroes";
    const isPlayer = segments[0] === "players";

    const type = segments[0];
    const validTypes = ["maps", "heroes", "players"]
    const matched = validTypes.filter(type =>
        segments.includes(type)
    )      

    // if the url includes 2 of these pathnames /maps, /heroes, /players, the url will be invalid 
    const isInvalid = matched.length > 1

    useEffect(() => {
        if (!id) return
        if(!isMap && !isHero && !isPlayer) return
        if(isInvalid) return

        let endpoint = "";
        if (type === "maps") endpoint = `/api/v2/map/${id}`;
        if (type === "heroes") endpoint = `/api/v1/heroes/hero/${id}`;
        if (type === "players") endpoint = `/api/v1/player/${id}`;


        const run = async () => {
            setLoading(true)
            const data = await getOne<Data>(`https://marvelrivalsapi.com${endpoint}`, setError)
            setInfo(data)
            setLoading(false)
        }
    
        void run()
    }, [id, location.pathname])

    if(isInvalid) return null
    if (loading) return <LoadingScreen />;
    if (error) return <h2>{error}</h2>;
    return (
        <>
            {isMap && <MapDetail rivalsMap={info as RivalsMap}/>}
            {isHero && <HeroDetail hero={info as HeroObj} />}
            {isPlayer && <PlayerDetail />}
        </>
    );
};

export default MapDetails;
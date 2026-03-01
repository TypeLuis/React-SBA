import React from 'react';
import type { RivalsMap } from '../types/types';
import { getImages } from '../utilities/functions';
import MovingImage from '../Components/MovingImages';
import { useNavigate } from 'react-router-dom';

interface MapProps {
    rivalMaps: RivalsMap[]
}

const Maps = ({ rivalMaps }: MapProps) => {

    const [selected, setSelected] = React.useState("")
    const navigate = useNavigate()

    const mapImages = getImages(
        rivalMaps,
        (m) => m.id,
        (m) => m.name,
        (m) => m.images[2]
    )

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!selected) return;
        navigate(`/maps/${selected}`)
    }

    const MapForm = () => {
        return (
            <form onSubmit={handleSubmit}>
            <select
                value={selected}
                onChange={(e) => setSelected(e.target.value)}
                required
            >
                <option value="" disabled selected>Select a Map</option>
                {rivalMaps.map((item) => {
                    return (
                        <option key={item.id} value={item.id}>{item.name}</option>
                    )
                })}
            </select>
            <input type="submit" value="Submit" disabled={!selected}/>
        </form>
        )
    }
    return (
        <MovingImage imgs={mapImages}>
            <div>
                <h1>Select your map</h1>
                <MapForm />
            </div>
        </MovingImage>
    );
};

export default Maps;
import React from 'react';
import type { RivalsMap } from '../types/types';
import { getImages } from '../utilities/functions';
import MovingImage from '../Components/MovingImages';

interface MapProps {
    rivalMaps: RivalsMap[]
}

const Maps = ({ rivalMaps }: MapProps) => {
    const mapImages = getImages(
        rivalMaps,
        (m) => m.id,
        (m) => m.name,
        (m) => m.images[2]
    )
    return (
        <MovingImage imgs={mapImages}>
            <div>
                <h1>Find Your Hero</h1>
                <form>...</form>
            </div>
        </MovingImage>
    );
};

export default Maps;
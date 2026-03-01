import React from 'react';
import { getImages } from '../utilities/functions';
import type { Hero } from '../types/types';
import MovingImage from '../Components/MovingImages';

type HeroProps = {
    heros: Hero[],
}

const Heros = ({ heros }: HeroProps) => {
    const heroImages = getImages(
        heros,
        (h) => h.id,
        (h) => h.name,
        (h) => h.imageUrl
    )
    return (
        <MovingImage imgs={heroImages}>
            <div>
                <h1>Find Your Hero</h1>
                <form>...</form>
            </div>
        </MovingImage>
    );
};

export default Heros;
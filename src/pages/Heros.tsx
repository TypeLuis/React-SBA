import React from 'react';
import { getImages } from '../utilities/functions';
import type { Hero } from '../types/types';
import MovingImage from '../Components/MovingImages';
import { useNavigate } from 'react-router-dom';

type HeroProps = {
    heros: Hero[],
}

const Heros = ({ heros }: HeroProps) => {
    const [selected, setSelected] = React.useState('')
    const navigate = useNavigate()

    const heroImages = getImages(
        heros,
        (h) => h.id,
        (h) => h.name,
        (h) => h.imageUrl
    )

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!selected) return;
        navigate(`/heroes/${selected}`)
    }

    const HeroForm = () => {
        return (
            <form onSubmit={handleSubmit}>
            <select
                value={selected}
                onChange={(e) => setSelected(e.target.value)}
                required
            >
                <option value="" disabled selected>Select a Character</option>
                {heros.map((item) => {
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
        <MovingImage imgs={heroImages}>
            <div>
                <h1>Find Your Hero</h1>
                <HeroForm />
            </div>
        </MovingImage>
    );
};

export default Heros;
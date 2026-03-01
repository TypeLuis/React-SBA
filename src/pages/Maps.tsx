import React from 'react';
import type { RivalsMap } from '../types/types';
import { getImages } from '../utilities/functions';
import MovingImage from '../Components/MovingImages';
import { useNavigate } from 'react-router-dom';
import '../Styles/InfoSearch.scss';

interface MapProps {
  rivalMaps: RivalsMap[];
}

const Maps = ({ rivalMaps }: MapProps) => {
  const [selected, setSelected] = React.useState('');
  const navigate = useNavigate();

  const mapImages = getImages(
    rivalMaps,
    (m) => m.id,
    (m) => m.name,
    (m) => m.images[2]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    navigate(`/maps/${selected}`);
  };

  return (
    <MovingImage imgs={mapImages}>
      <div className="select">
        <h1 className="select__title">Select Your Map</h1>
        <form className="select__form" onSubmit={handleSubmit}>
          <select
            className="select__select"
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            required
          >
            <option value="" disabled>Select a Map</option>
            {rivalMaps.map((item) => (
              <option key={item.id} value={item.id}>{item.name}</option>
            ))}
          </select>
          <input
            className="select__submit"
            type="submit"
            value="Enter Map"
            disabled={!selected}
          />
        </form>
      </div>
    </MovingImage>
  );
};

export default Maps;
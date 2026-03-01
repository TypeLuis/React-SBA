// import MovingImage from '../Components/MovingImages';
// import type { Hero, RivalsMap  } from '../types/types';
// import { getImages } from '../utilities/functions';

// type HomeProps = {
//     heros: Hero[],
//     rivalMaps: RivalsMap[]
// } 

// const Home = ({heros, rivalMaps}: HomeProps) => {

//     const heroImages = getImages(
//       heros,
//       (h) => h.id,
//       (h)=> h.name,
//       (h) => h.imageUrl
//     )
    
//     const mapImages = getImages(
//       rivalMaps,
//       (m) => m.id,
//       (m) => `${m.name} - ${m.id}`,
//       (m) => m.images[2] 
//     )

//     return (
//         <>
//           <MovingImage imgs={heroImages} />
//           <MovingImage imgs={mapImages} />
//         </>
//       );
// }

// export default Home

import { Link } from 'react-router-dom';
import MovingImage from '../Components/MovingImages';
import type { Hero, RivalsMap } from '../types/types';
import { getImages } from '../utilities/functions';
import '../Styles/Home.scss';

type HomeProps = {
  heros: Hero[];
  rivalMaps: RivalsMap[];
};

const Home = ({ heros, rivalMaps }: HomeProps) => {

  const heroImages = getImages(
    heros,
    (h) => h.id,
    (h) => h.name,
    (h) => h.imageUrl
  );

  const mapImages = getImages(
    rivalMaps,
    (m) => m.id,
    (m) => `${m.name} - ${m.id}`,
    (m) => m.images[2]
  );

  // Interleave hero + map images so columns are visually varied
  const combined = heroImages.flatMap((h, i) => [h, mapImages[i % mapImages.length]]);

  return (
    <MovingImage imgs={combined} numCols={6}>
      <div className="home-overlay">
        <p className="home-overlay__eyebrow">Marvel Rivals</p>
        <h1 className="home-overlay__title">
          <span>ENTER THE</span>
          <span className="home-overlay__title-accent">RIVALRY</span>
        </h1>
        <p className="home-overlay__tagline">
          Explore heroes, maps, and player stats from the universe's greatest battlegrounds.
        </p>
        <nav className="home-overlay__nav">
          <Link to="/heroes" className="home-overlay__btn home-overlay__btn--primary">
            Heroes
          </Link>
          <Link to="/maps" className="home-overlay__btn">
            Maps
          </Link>
          <Link to="/players" className="home-overlay__btn">
            Players
          </Link>
        </nav>
      </div>
    </MovingImage>
  );
};

export default Home;
import MovingImage from '../Components/MovingImages';
import type { Hero, ImgInfo, RivalsMap  } from '../types/types';
import { getImages } from '../utilities/functions';

type HomeProps = {
    heros: Hero[],
    rivalMaps: RivalsMap[]
} 

const Home = ({heros, rivalMaps}: HomeProps) => {

    const heroImages = getImages(
      heros,
      (h) => h.id,
      (h)=> h.name,
      (h) => h.imageUrl
    )
    
    const mapImages = getImages(
      rivalMaps,
      (m) => m.id,
      (m) => `${m.name} - ${m.id}`,
      (m) => m.images[2] 
    )

    return (
        <>
          <MovingImage imgs={heroImages} />
          <MovingImage imgs={mapImages} />
        </>
      );
}

export default Home
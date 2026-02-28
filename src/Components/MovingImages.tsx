import { useEffect, useState, useRef } from 'react'
import '../Styles/MovingImages.scss'
import type { ImgInfo } from '../types/types';

type MovingImageProps = {
    imgs: ImgInfo[];
};

const ORIGIN = "https://marvelrivalsapi.com";
const BASE_IMAGES = `${ORIGIN}/rivals`;

export function toImageUrl(path?: string): string {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  if (path.startsWith("/rivals/")) return `${ORIGIN}${path}`;
  return `${BASE_IMAGES}${path.startsWith("/") ? "" : "/"}${path}`;
}


const chunk = <T,>(arr: T[], size: number): T[][] => {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
};

function MovingImage ({imgs} : MovingImageProps) {
  const [columns, setColumns] = useState<ImgInfo[][]>([]);

  // We use refs to the inner divs for pure-DOM animation
  const colRefs = useRef<Array<HTMLDivElement | null>>([]);

  const shuffleArray = <T,>(array: T[]): T[] => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  useEffect(() => {
    const picked = shuffleArray(imgs).slice(0, 12);
    setColumns(chunk(picked, 3));
  }, [])


  useEffect(() => {
    if (columns.length !== 4) return;

    const speeds = [0.4, 0.5, 0.4, 0.5];
    const travels = [0, 0, 0, 0];
    const rafIds: number[] = [];

    const loop = (i: number) => {
      const el = colRefs.current[i];
      const c0 = el?.children[0] as HTMLElement | undefined;
      const c1 = el?.children[1] as HTMLElement | undefined;
      const step = c0 && c1 ? c1.offsetTop - c0.offsetTop : 0;

      if (el && step) {
        travels[i] += speeds[i];
        if (travels[i] >= step) {
          travels[i] -= step;
          i % 2 === 0 ? el.appendChild(el.firstChild!) : el.insertBefore(el.lastChild!, el.firstChild);
        }
        el.style.transform = `translateY(${i % 2 === 0 ? -travels[i] : travels[i] - step}px)`;
      }

      rafIds[i] = requestAnimationFrame(() => loop(i));
    };

    for (let i = 0; i < 4; i++) rafIds[i] = requestAnimationFrame(() => loop(i));

    return () => rafIds.forEach(cancelAnimationFrame);
  }, [columns.length]);

  return (
    <main>
      {columns.map((col, colIndex) => {
        // Duplicate images so there's always a next image to scroll into view
        const items = [...col, ...col, ...col, ...col];
        return (
          <div key={colIndex}>
            <div
              className="inner"
              ref={(el) => { colRefs.current[colIndex] = el; }}
            >
              {items.map((hero, i) => (
                <img
                  key={`${hero.id}-${i}`}
                  src={toImageUrl(hero.image)}
                  alt={hero.name}
                />
              ))}
            </div>
          </div>
        );
      })}
    </main>
  );
}

export default MovingImage
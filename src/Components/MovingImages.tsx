import { useEffect, useState, useRef } from 'react'
import '../Styles/MovingImages.scss'
import type { ImgInfo } from '../types/types';

type MovingImageProps = {
  imgs: ImgInfo[];
  numCols?: number; // default 4
};

const ORIGIN = "https://marvelrivalsapi.com";
const BASE_IMAGES = `${ORIGIN}/rivals`;

export function toImageUrl(path?: string): string {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  if (path.startsWith("/rivals/")) return `${ORIGIN}${path}`;
  return `${BASE_IMAGES}${path.startsWith("/") ? "" : "/"}${path}`;
}

// Splits an array into groups of a specified size.
// Example: chunk([1,2,3,4,5,6], 3) => [[1,2,3],[4,5,6]]
const chunk = <T,>(arr: T[], size: number): T[][] => {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
};

// Repeat array until it reaches at least `minLength`
const padToLength = <T,>(arr: T[], minLength: number): T[] => {
  if (arr.length === 0) return [];
  const out: T[] = [];
  while (out.length < minLength) out.push(...arr);
  return out;
};

// Returns a new randomly shuffled copy of the array without mutating the original.
const shuffleArray = <T,>(array: T[]): T[] => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

function MovingImage({ imgs, numCols = 4 }: MovingImageProps) {
  const [columns, setColumns] = useState<ImgInfo[][]>([]);
  const colRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    if (!imgs.length) return;

    const cols = Math.min(numCols, imgs.length); // can't have more cols than images
    const colSize = Math.ceil(imgs.length / cols);

    // Shuffle and split into columns
    const raw = chunk(shuffleArray(imgs), colSize).slice(0, cols);

    // Each column needs enough images to fill the viewport + buffer.
    // viewport height / image height gives visible count; we want at least 2x that.
    const imgHeight = window.innerHeight / 4; // rough estimate: ~4 images visible per col
    const minPerCol = Math.ceil((window.innerHeight / imgHeight) * 2) + 2;

    const padded = raw.map((col) => padToLength(col, minPerCol));
    setColumns(padded);
  }, [imgs, numCols]);

  useEffect(() => {
    if (!columns.length) return;

    const speeds = [0.4, 0.5, 0.4, 0.5];
    const travels = columns.map(() => 0);
    const rafIds: number[] = [];

    const loop = (i: number) => {
      const el = colRefs.current[i];
      const c0 = el?.children[0] as HTMLElement | undefined;
      const c1 = el?.children[1] as HTMLElement | undefined;
      const step = c0 && c1 ? c1.offsetTop - c0.offsetTop : 0;

      if (el && step) {
        travels[i] += speeds[i % speeds.length];
        if (travels[i] >= step) {
          travels[i] -= step;
          i % 2 === 0
            ? el.appendChild(el.firstChild!)
            : el.insertBefore(el.lastChild!, el.firstChild);
        }
        el.style.transform = `translateY(${i % 2 === 0 ? -travels[i] : travels[i] - step}px)`;
      }

      rafIds[i] = requestAnimationFrame(() => loop(i));
    };

    for (let i = 0; i < columns.length; i++) rafIds[i] = requestAnimationFrame(() => loop(i));

    return () => rafIds.forEach(cancelAnimationFrame);
  }, [columns.length]);

  return (
    <main>
      {columns.map((col, colIndex) => (
        <div key={colIndex}>
          <div
            className="inner"
            ref={(el) => { colRefs.current[colIndex] = el; }}
          >
            {col.map((hero, i) => (
              <img
                key={`${hero.id}-${i}`}
                src={toImageUrl(hero.image)}
                alt={hero.name}
              />
            ))}
          </div>
        </div>
      ))}
    </main>
  );
}

export default MovingImage
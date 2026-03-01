import { useEffect, useState, useRef } from 'react'
import '../Styles/MovingImages.scss'
import type { ImgInfo } from '../types/types';
import { chunk, padToLength, shuffleArray, toImageUrl } from '../utilities/functions';

type MovingImageProps = {
  imgs: ImgInfo[];
  numCols?: number; // default 4
  children?: React.ReactNode;
};


function MovingImage({ imgs, numCols = 4, children }: MovingImageProps) {
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
            {col.map((img, i) => (
              <img
                key={`${img.id}-${i}`}
                src={toImageUrl(img.image)}
                alt={img.name}
              />
            ))}
          </div>
        </div>
      ))}

      {children && (
        <div className="moving-image__overlay">
          {children}
        </div>
      )}
    </main>
  );
}

export default MovingImage
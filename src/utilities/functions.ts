import type { ImgInfo } from "../types/types";

// This function get's the id, name, and imageURL of a api endpoint regardless if the key:value pair is different
// getId: (item: T) => string | number -> This is a function parameter. We need it because Because Hero and RivalsMap don’t have the same structure. Example, RivalsMap return a integer ID, Hero returns string ID
export const getImages = <T,>(
    arr: T[],
    getId: (item: T) => string | number,
    getName: (item: T) => string,
    getImage: (item: T) => string
): ImgInfo[] => {
    if (!Array.isArray(arr)) return []
    return arr.map((item) => ({
        id: String(getId(item)),
        name: getName(item),
        image: getImage(item),
    }));
}



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
export const chunk = <T,>(arr: T[], size: number): T[][] => {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
};

// Repeat array until it reaches at least `minLength`
export const padToLength = <T,>(arr: T[], minLength: number): T[] => {
  if (arr.length === 0) return [];
  const out: T[] = [];
  while (out.length < minLength) out.push(...arr);
  return out;
};

// Returns a new randomly shuffled copy of the array without mutating the original.
export const shuffleArray = <T,>(array: T[]): T[] => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};
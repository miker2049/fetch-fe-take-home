import { getBreeds } from "./api";

export async function isLoggedIn() {
  try {
    await getBreeds();
    return true;
  } catch (err) {
    return false;
  }
}

// super fancy validate zip code function
export function isValidZip(n: number | string) {
  if (typeof n === "string") return n.length === 5;
  else return n.toString().length === 5;
}

export class DogCache {
  cache: any;
  constructor() {
    this.cache = {};
  }
  searchDogs(){

  }
  cacheResults(breed: string, from: number, results: any) {
    const hash = `${breed}-${from}`;
    this.cache[hash] = results;
  }
  getCacheResult(breed: string, from: number) {
    const hash = `${breed}-${from}`;
    if (this.cache[hash]) {
      return this.cache[hash];
    } else {
      return undefined;
    }
  }
}

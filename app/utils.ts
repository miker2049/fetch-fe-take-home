import { getBreeds } from "./api";

export async function isLoggedIn() {
  try {
    const breeds = await getBreeds();
    console.log(breeds, "BREEDs");
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

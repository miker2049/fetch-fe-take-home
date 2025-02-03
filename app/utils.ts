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

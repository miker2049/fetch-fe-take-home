import { Form, redirect, useSearchParams } from "react-router";
import { isLoggedIn, isValidZip } from "./utils";
import type { Route } from "./+types/search";

const RESULT_SIZE = 25;

import {
  getBreeds,
  getDogs,
  searchDogs,
  type Dog,
  type SearchDogsParams,
} from "./api";
import { DogResult } from "./Dog";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "DogMatch" },
    { name: "description", content: "Match with a dog, on DogMatch." },
  ];
}
export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  try {
    const breeds = await getBreeds();
    if (!breeds) return redirect("/login");

    const searchParams = new URL(request.url).searchParams;
    const breed = searchParams.get("breed");
    const zipcode = searchParams.get("zipcode");
    const pageParam = searchParams.get("page");
    const page = pageParam ? parseInt(pageParam) - 1 : 0;
    const fromParam = searchParams.get("from");
    const from = (fromParam || page * RESULT_SIZE).toString();

    let dogs = null;
    let searchResults = null;

    if (breed) {
      const q: SearchDogsParams = {
        breeds: [breed],
        size: RESULT_SIZE,
        from,
      };

      if (zipcode && isValidZip(zipcode)) {
        q.zipCodes = [zipcode];
      }

      searchResults = await searchDogs(q);
      dogs = await getDogs(searchResults.resultIds);
    }

    return {
      breeds,
      dogs,
      ...searchResults,
      currentBreed: breed,
      currentZip: zipcode,
      page: page + 1,
    };
  } catch (_) {
    return redirect("/login");
  }
}

export default function Search({ loaderData }: Route.ComponentProps) {
  const results = loaderData;
  return (
    <>
      <Form method="GET">
        <label htmlFor="breed">Select breed:</label>
        <select name="breed" defaultValue={loaderData.currentBreed || ""}>
          {loaderData.breeds.map((it: string) => (
            <option key={it} value={it}>
              {it}
            </option>
          ))}
        </select>
        <label htmlFor="zipcode">Enter zip:</label>
        <input
          type="number"
          name="zipcode"
          defaultValue={loaderData.currentZip || ""}
        />
        <label htmlFor="page">Page</label>
        <input
          type="number"
          name="page"
          min={1}
          max={(loaderData.total || Infinity) / RESULT_SIZE}
          defaultValue={loaderData.page || 1}
        />
        <button type="submit">Search</button>
      </Form>
      {results.dogs && (
        <div>
          <p>
            Displaying {(results.page - 1) * RESULT_SIZE}-
            {(results.dogs?.length || 0) + (results.page - 1) * RESULT_SIZE} of{" "}
            {results.total} results
          </p>
          {results.dogs.map((dog: Dog) => (
            <DogResult
              key={dog.id}
              isFave={false}
              toggleFavorite={() => undefined}
              data={dog}
            />
          ))}
        </div>
      )}
    </>
  );
}

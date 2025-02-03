import { Form, NavLink, redirect, useSearchParams } from "react-router";
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
import { useState } from "react";
import { SmallDogCard } from "./SmallDogCard";

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
    const breed = searchParams.get("breeds");
    const zipcode = searchParams.get("zipCodes");
    // if neither from or page param, from is 0
    let from = "0";
    const pageParam = searchParams.get("page");

    const fromParam = searchParams.get("from");
    if (pageParam) from = ((parseInt(pageParam) - 1) * RESULT_SIZE).toString();
    if (fromParam) from = fromParam;

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
      page: Math.floor(parseInt(from) / RESULT_SIZE) + 1,
    };
  } catch (_) {
    return redirect("/login");
  }
}

export type FaveDog = {
  id: string;
  name: string;
  img: string;
};

export default function Search({ loaderData }: Route.ComponentProps) {
  const results = loaderData;
  // grab the query params from "next" and "prev" results
  // Looks a little hacky, but its less hacky then just regexing probably... right?
  const nextParams = results.next
    ? new URL("https://example.com" + results.next).searchParams.toString()
    : undefined;
  const prevParams = results.next
    ? new URL("https://example.com" + results.prev).searchParams.toString()
    : undefined;

  // store fave dogs also in local storage!
  const [faveDogs, setFaveDogs] = useState<FaveDog[]>(() => {
    const stored = localStorage.getItem("fave-dogs");
    return stored ? JSON.parse(stored) : [];
  });

  const toggleFave = (dog: Dog) => {
    setFaveDogs((curr) => {
      const newFaves = curr.some((d) => d.id === dog.id)
        ? curr.filter((d) => d.id !== dog.id)
        : [...curr, { id: dog.id, name: dog.name, img: dog.img }];
      localStorage.setItem("fave-dogs", JSON.stringify(newFaves));
      return newFaves;
    });
  };
  return (
    <>
      <div>
        <p className="bold">Your faves:</p>
        {faveDogs.length > 0 && <button type="button">Find your match!</button>}
        <div className="w-full overflow-x-auto">
          <div className="flex gap-2 p-4 overflow-x-auto">
            {faveDogs.map((dog, idx) => (
              <SmallDogCard {...dog} key={`fave-dog-${idx}`} />
            ))}
          </div>
        </div>
      </div>
      <Form method="GET">
        <label htmlFor="breeds">Select breed:</label>
        <select name="breeds" defaultValue={loaderData.currentBreed || ""}>
          {loaderData.breeds.map((it: string) => (
            <option key={it} value={it}>
              {it}
            </option>
          ))}
        </select>
        <label htmlFor="zipcode">Enter zip:</label>
        <input
          type="number"
          name="zipCodes"
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
          <div className="flex">
            {prevParams && <NavLink to={"/?" + prevParams}>previous</NavLink>}
            {nextParams && <NavLink to={"/?" + nextParams}>next</NavLink>}
          </div>
          {results.dogs.map((dog: Dog) => (
            <DogResult
              key={dog.id}
              isFave={faveDogs.some((d) => d.id === dog.id)}
              toggleFavorite={() => toggleFave(dog)}
              data={dog}
            />
          ))}
        </div>
      )}
    </>
  );
}

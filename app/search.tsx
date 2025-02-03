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
    <div className="md:px-24 px-4">
      <details>
        <summary>Your faves</summary>
        <div>
          <div className="w-full overflow-x-auto">
            <div className="flex gap-2 p-4 overflow-x-auto">
              {faveDogs.map((dog, idx) => (
                <SmallDogCard {...dog} key={`fave-dog-${idx}`} />
              ))}
              {faveDogs.length > 0 && (
                <button type="button" className="nes-btn">
                  Find your match!
                </button>
              )}
            </div>
          </div>
        </div>
      </details>
      <Form method="GET">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label
              htmlFor="breeds"
              className="block text-sm font-medium text-gray-700"
            >
              Select breed:
            </label>
            <div class="nes-select">
              <select
                name="breeds"
                defaultValue={loaderData.currentBreed || ""}
              >
                {loaderData.breeds.map((it: string) => (
                  <option key={it} value={it}>
                    {it}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="nes-field">
            <label
              htmlFor="zipcode"
              className="block text-sm font-medium text-gray-700"
            >
              Enter zip:
            </label>
            <input
              type="number"
              name="zipCodes"
              defaultValue={loaderData.currentZip || ""}
              className="nes-input"
            />
          </div>

          <div className="nes-field">
            <label htmlFor="page">Page</label>
            <input
              type="number"
              name="page"
              id="page"
              min={1}
              max={(loaderData.total || Infinity) / RESULT_SIZE}
              defaultValue={loaderData.page || 1}
              className="nes-input"
            />
          </div>

          <div className="flex items-end">
            <button type="submit" className="nes-btn is-primary">
              Search
            </button>
          </div>
        </div>
      </Form>
      {results.dogs && (
        <div>
          <div className="nes-container flex gap-x-4 m-2">
            <p className="flex-grow">
              Displaying {(results.page - 1) * RESULT_SIZE}-
              {(results.dogs?.length || 0) + (results.page - 1) * RESULT_SIZE}{" "}
              of {results.total} results
            </p>
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
    </div>
  );
}

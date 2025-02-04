import {
  Form,
  NavLink,
  redirect,
  useSearchParams,
  useSubmit,
} from "react-router";
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
import { useMemo, useRef, useState } from "react";
import { SmallDogCard } from "./SmallDogCard";
import { Match } from "./Match";

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

    const sortParam = searchParams.get("sort");
    const sort = sortParam || "breed:asc";

    let dogs = null;
    let searchResults = null;

    if (breed) {
      const q: SearchDogsParams = {
        breeds: [breed],
        size: RESULT_SIZE,
        from,
        sort,
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

  const toggleFave = (dog: { id: string; name: string; img: string }) => {
    setFaveDogs((curr) => {
      const newFaves = curr.some((d) => d.id === dog.id)
        ? curr.filter((d) => d.id !== dog.id)
        : [...curr, { id: dog.id, name: dog.name, img: dog.img }];
      localStorage.setItem("fave-dogs", JSON.stringify(newFaves));
      return newFaves;
    });
  };

  // match modal
  //
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [showMatch, setShowMatch] = useState(false);

  const openModal = () => {
    dialogRef.current?.showModal();
    console.log(faveIds);
    setShowMatch(true);
  };

  const closeModal = () => {
    dialogRef.current?.close();
    setShowMatch(false);
  };

  const faveIds = useMemo(() => faveDogs.map((it) => it.id), [faveDogs]);

  const submit = useSubmit();
  return (
    <div className="md:px-24 px-4">
      <dialog ref={dialogRef} className="nes-dialog m-auto" id="dialog-default">
        <form method="dialog">
          <Match
            ids={faveIds}
            showing={showMatch}
            close={() => {
              setFaveDogs([]);
              closeModal();
            }}
          />
        </form>
      </dialog>
      <details>
        <summary>Your faves</summary>
        <div>
          <div className="w-full overflow-x-auto">
            <div className="flex gap-2 p-4 overflow-x-auto">
              {faveDogs.map((dog, idx) => (
                <div key={`fave-dog-${idx}`} className="relative group ">
                  <div className="absolute bottom-2 right-1 z-10">
                    <button
                      onClick={() => toggleFave(dog)}
                      className="nes-btn is-error opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Remove from favorites"
                    >
                      ×
                    </button>
                  </div>
                  <SmallDogCard {...dog} />
                </div>
              ))}
              {faveDogs.length > 0 && (
                <section>
                  <button
                    type="button"
                    className="nes-btn is-primary"
                    onClick={openModal}
                  >
                    Get your match
                  </button>
                </section>
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
            <div className="nes-select">
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
              max={Math.max(1, (loaderData.total || Infinity) / RESULT_SIZE)}
              defaultValue={Math.max(1, loaderData.page) || 1}
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
            <Form method="GET" className="flex items-center gap-4">
              <input
                type="hidden"
                name="breeds"
                value={results.currentBreed || ""}
              />
              <input
                type="hidden"
                name="zipCodes"
                value={results.currentZip || ""}
              />
              <input type="hidden" name="page" value={results.page} />
              <label>
                <input
                  type="radio"
                  className="nes-radio"
                  name="sort"
                  value="name:asc"
                  defaultChecked={!results.sort?.includes("desc")}
                  onChange={(e) =>
                    submit(
                      {
                        breeds: [results.currentBreed],
                        zipCodes: [results.zipCodes],
                        page: 1,
                        sort: "name:asc",
                      },
                      { action: "/", method: "get" }
                    )
                  }
                />
                <span>A-Z</span>
              </label>
              <label>
                <input
                  type="radio"
                  className="nes-radio"
                  name="sort"
                  value="name:desc"
                  defaultChecked={results.sort?.includes("desc")}
                  onChange={(e) =>
                    submit(
                      {
                        breeds: [results.currentBreed],
                        zipCodes: [results.zipCodes],
                        page: 1,
                        sort: "name:desc",
                      },
                      { action: "/", method: "get" }
                    )
                  }
                />
                <span>Z-A</span>
              </label>
            </Form>
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

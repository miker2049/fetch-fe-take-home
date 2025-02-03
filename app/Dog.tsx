import { useEffect, useState } from "react";
import { getDogs, type Dog } from "./api";

export function DogResult({
  data,
  isFave,
  toggleFavorite,
}: {
  data: Dog;
  isFave: boolean;
  toggleFavorite: () => void;
}) {
  return (
    <div className="flex p-4 gap-4 items-center border rounded-lg shadow-md m-4">
      <div className="w-48 h-48 flex-shrink-0">
        <img
          src={data.img}
          className="w-full h-full object-cover object-center rounded-lg"
          alt={"A picture of " + data.name}
        />
      </div>
      <div className="flex-grow">
        <h3 className="text-xl font-bold">Name: {data.name}</h3>
        <p className="text-gray-700">Breed: {data.breed}</p>
        <p className="text-gray-700">Age: {data.age}</p>
        <p className="text-gray-700">Zip: {data.zip_code}</p>
      </div>
      <div className="flex items-center gap-2">
        <label htmlFor="fave" className="text-sm">
          Favorite?
        </label>
        <input
          type="checkbox"
          name="fave"
          onChange={toggleFavorite}
          checked={isFave}
          className="w-5 h-5"
        />
      </div>
    </div>
  );
}

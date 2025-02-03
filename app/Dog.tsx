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
    <div className="flex">
      <img src={data.img} />
      <div>
        <h3>Name: {data.name}</h3>
        <p>Breed: {data.breed}</p>
        <p>Age: {data.age}</p>
        <p>Zip: {data.zip_code}</p>
      </div>
      <label htmlFor="fave">Favorite?</label>
      <input
        type="checkbox"
        name="fave"
        onChange={toggleFavorite}
        checked={isFave}
      />
    </div>
  );
}

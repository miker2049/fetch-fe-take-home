import { type FaveDog } from "./search";

export function SmallDogCard({ id, name, img }: FaveDog) {
  return (
    <div className="p-1 flex-shrink-0 w-32 m-2 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow border border-gray-200">
      <img
        src={img}
        className="place-self-center h-32 object-center m-auto"
        alt={"A picture of " + name}
      />
      <p className="p-2 text-center text-sm truncate">{name}</p>
    </div>
  );
}

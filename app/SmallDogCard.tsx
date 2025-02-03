import { type FaveDog } from "./search";

export function SmallDogCard({ id, name, img }: FaveDog) {
  return (
    <div className="nes-container with-title">
      <p className="title">{name}</p>
      <img
        src={img}
        className="place-self-center max-h-24 object-center m-auto"
        alt={"A picture of " + name}
      />
    </div>
  );
}

import { useEffect, useState } from "react";
import { type Dog, getDogs, matchDog } from "./api";
import { SmallDogCard } from "./SmallDogCard.tsx";

export function Match({ ids, showing }: { ids: string[]; showing: boolean }) {
  const [match, setMatch] = useState<{ match?: Dog; err?: string }>();
  useEffect(() => {
    try {
      matchDog(ids)
        .then((match) => {
          return getDogs([match.match]);
        })
        .then((dog) => {
          setMatch({ match: dog[0] });
        });
    } catch (err) {
      setMatch({ err: String(err) });
    }
  }, [ids, showing]);
  if (match && match.match && !match.err)
    return (
      <div>
        <p> The dog the is best for you is:</p>
        <SmallDogCard
          name={match.match.name}
          img={match.match.img}
          id={match.match.id}
        />
      </div>
    );
  else
    return (
      <progress
        className="nes-progress is-primary"
        value="80"
        max="100"
      ></progress>
    );
}

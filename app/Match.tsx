import { useEffect, useState } from "react";
import { type Dog, getDogs, matchDog } from "./api";
import { SmallDogCard } from "./SmallDogCard.tsx";

export function Match({
  ids,
  showing,
  close,
}: {
  ids: string[];
  showing: boolean;
  close: () => void;
}) {
  const [match, setMatch] = useState<{ match?: Dog; err?: string }>();
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    setMatch(undefined); // Reset match when ids change
    setProgress(0); // Reset progress

    // Progress animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 10, 90)); // Increment up to 90%
    }, 200);

    const timer = setTimeout(() => {
      try {
        matchDog(ids)
          .then((match) => {
            return getDogs([match.match]);
          })
          .then((dog) => {
            setProgress(100); // Complete the progress
            setMatch({ match: dog[0] });
          });
      } catch (err) {
        setMatch({ err: String(err) });
      }
    }, 2000); // 2 second delay

    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
    }; // Cleanup timers on unmount
  }, [ids, showing]);
  if (!showing) return null;

  if (match?.match && !match.err) {
    return (
      <div className="flex gap-y-2 flex-col">
        <p>The dog that is best for you is:</p>
        <SmallDogCard
          name={match.match.name}
          img={match.match.img}
          id={match.match.id}
        />
        <button className="nes-btn is-primary centered m-2" onClick={close}>
          Start again?
        </button>
      </div>
    );
  }

  return (
    <div>
      Running dog calculations...
      <progress
        className="nes-progress is-primary"
        value={progress}
        max="100"
      ></progress>
    </div>
  );
}

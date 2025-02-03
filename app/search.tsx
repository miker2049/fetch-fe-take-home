import { redirect } from "react-router";
import { isLoggedIn } from "./utils";
import type { Route } from "./+types/search";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "DogMatch" },
    { name: "description", content: "Match with a dog, on DogMatch." },
  ];
}
export async function clientLoader() {
  if (!(await isLoggedIn())) return redirect("/login");
}
export default function Search() {
  return <p>This is the search page</p>;
}

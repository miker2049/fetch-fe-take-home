import { NavLink, Outlet } from "react-router";
import type { Route } from "./+types/layout";
import { isLoggedIn } from "./utils";

export async function clientLoader() {
  if (!(await isLoggedIn())) return undefined;
  if (localStorage) {
    const name = localStorage.getItem("dogmatch-user");
    if (name) return { name };
  }
  return undefined;
}

export default function BaseLayout({ loaderData }: Route.ComponentProps) {
  return (
    <div>
      <header>
        <p className="flex-grow">DogMatch</p>
        {loaderData && <p>Logged in as {loaderData.name}</p>}
        {loaderData && <NavLink to="/logout">Logout</NavLink>}
      </header>
      <div className="main-container">
        <Outlet />
      </div>
    </div>
  );
}

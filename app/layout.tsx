import { NavLink, Outlet, redirect, useNavigate } from "react-router";
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
  const navigate = useNavigate();
  return (
    <div>
      <header className="flex gap-x-2 items-center">
        <p className="flex-grow">DogMatch</p>
        {loaderData && (
          <p>
            Logged in as{" "}
            <span className="nes-text is-primary">{loaderData.name}</span>
          </p>
        )}
        {loaderData && (
          <button
            className="nes-btn is-error"
            type="button"
            onClick={() => {
              navigate("/logout");
            }}
          >
            Logout
          </button>
        )}
      </header>
      <div className="main-container">
        <Outlet />
      </div>
    </div>
  );
}

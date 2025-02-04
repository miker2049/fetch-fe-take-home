import { Outlet, useNavigate } from "react-router";
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
      <header className="flex items-center gap-4 bg-slate-200 px-6 py-3">
        <h1 className="text-xl font-bold flex-grow">DogMatch</h1>
        {loaderData && (
          <>
            <p className="text-sm whitespace-nowrap">
              Logged in as{" "}
              <span className="nes-text is-primary">{loaderData.name}</span>
            </p>
            <button
              className="nes-btn is-error"
              type="button"
              onClick={() => {
                navigate("/logout");
              }}
            >
              Logout
            </button>
          </>
        )}
      </header>
      <div className="main-container">
        <Outlet />
      </div>
    </div>
  );
}

import { Outlet } from "react-router";

export default function BaseLayout() {
  return (
    <div>
      <header>DogMatch</header>
      <div className="main-container">
        <Outlet />
      </div>
    </div>
  );
}

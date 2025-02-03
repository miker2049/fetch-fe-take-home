import { redirect } from "react-router";
import { logout } from "./api";

export async function clientLoader() {
  try {
    await logout();
    localStorage.clear();
  } catch (err) {
    console.log(err);
  } finally {
    return redirect("/login");
  }
}
export default function Logout() {
  return <></>;
}

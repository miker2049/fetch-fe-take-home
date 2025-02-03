import { useEffect, useState } from "react";
import type { Route } from "./+types/login";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Login to dog app" },
    { name: "description", content: "Please login to see dogs" },
  ];
}

async function isLoggedIn() {
  try {
    const breeds = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/breeds`);
    if (breeds.status !== 200) return false;
    else return true;
  } catch (err) {
    return false;
  }
}

export default function Login() {
  const [loggedIn, setLoggedIn] = useState<{ email: string }>();
  // useEffect(()=>{

  // })
  return (
    <>
      <h1> Find the dog you want, DogSearch</h1>
      <div>{loggedIn && <p> You are logged in as {loggedIn.email}</p>}</div>
      <div>{!loggedIn && <p> You are not logged in</p>}</div>
      <form>
        <label htmlFor="login-email-input">Email:</label>
        <input type="text" name="login-email-input" />
        <label htmlFor="login-pw-input">Password:</label>
        <input type="password" name="login-pw-input" />
        <button
          type="button"
          onClick={() => isLoggedIn().then((it) => console.log(it))}
        >
          Login
        </button>
      </form>
    </>
  );
}

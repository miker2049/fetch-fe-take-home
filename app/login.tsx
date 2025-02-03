import { useEffect, useState } from "react";
import type { Route } from "./+types/login";
import { Form, redirect } from "react-router";
import { login } from "./api";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Login to DogMatch" },
    { name: "description", content: "Please login to see dogs" },
  ];
}

export async function clientAction({ request }: Route.ClientActionArgs) {
  const formData = await request.formData();
  const email = String(formData.get("email"));
  const name = String(formData.get("name"));
  if (!name || !email) {
    return { err: "Please enter both fields!" };
  }
  try {
    const res = await login(name, email);

    if (res.status === 200) {
      localStorage.setItem("dogmatch-user", name);
      return redirect("/");
    } else return { err: "Trouble logging in... Sorry about that!" };
  } catch (err) {
    return { err: "An API problem, hmmm " + err };
  }
}

export default function Login() {
  return (
    <div>
      <Form method="POST">
        <label htmlFor="name">Name:</label>
        <input type="text" name="name" />
        <label htmlFor="email">Email:</label>
        <input type="text" name="email" />
        <button type="submit">Login</button>
      </Form>
    </div>
  );
}

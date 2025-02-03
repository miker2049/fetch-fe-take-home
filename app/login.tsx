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
    <div className="flex justify-center items-center min-h-screen md:px-24 px-4">
      <div className="nes-container with-title">
        <h3 className="title">Login to DogMatch</h3>
        <Form method="POST" className="space-y-4">
          <div className="nes-field">
            <label htmlFor="name" className="block text-sm font-medium">
              Name:
            </label>
            <input 
              type="text" 
              name="name" 
              id="name"
              className="nes-input"
              required
            />
          </div>
          
          <div className="nes-field">
            <label htmlFor="email" className="block text-sm font-medium">
              Email:
            </label>
            <input 
              type="email" 
              name="email" 
              id="email"
              className="nes-input"
              required
            />
          </div>

          <div className="flex justify-center mt-6">
            <button type="submit" className="nes-btn is-primary">
              Login
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}

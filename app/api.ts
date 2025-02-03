export interface Dog {
  id: string;
  img: string;
  name: string;
  age: number;
  zip_code: string;
  breed: string;
}

interface Location {
  zip_code: string;
  latitude: number;
  longitude: number;
  city: string;
  state: string;
  county: string;
}

interface Coordinates {
  lat: number;
  lon: number;
}

export interface SearchDogsParams {
  breeds?: string[];
  zipCodes?: string[];
  ageMin?: number;
  ageMax?: number;
  size?: number;
  from?: string;
  sort?: string;
}

interface LocationSearchParams {
  city?: string;
  states?: string[];
  geoBoundingBox?: {
    top?: Coordinates;
    left?: Coordinates;
    bottom?: Coordinates;
    right?: Coordinates;
    bottom_left?: Coordinates;
    top_right?: Coordinates;
  };
  size?: number;
  from?: number;
}

const API_URL = import.meta.env.VITE_API_ENDPOINT;

const fetchApiRaw = async (path: string, options: RequestInit = {}) => {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  if (!response.ok) throw new Error(`API error: ${response.status}`);
  return response;
};
const fetchApi = async (path: string, options: RequestInit = {}) => {
  const response = await fetchApiRaw(path, options);
  return response.json();
};

export const login = (name: string, email: string) =>
  fetchApiRaw("/auth/login", {
    method: "POST",
    body: JSON.stringify({ name, email }),
  });

export const logout = () => fetchApiRaw("/auth/logout", { method: "POST" });

export const getBreeds = () => fetchApi("/dogs/breeds");

export const searchDogs = (params: SearchDogsParams) =>
  fetchApi(`/dogs/search?${new URLSearchParams(params as any)}`);

export const getDogs = (dogIds: string[]) =>
  fetchApi("/dogs", {
    method: "POST",
    body: JSON.stringify(dogIds),
  });

export const matchDog = (dogIds: string[]) =>
  fetchApi("/dogs/match", {
    method: "POST",
    body: JSON.stringify(dogIds),
  });

export const getLocations = (zipCodes: string[]) =>
  fetchApi("/locations", {
    method: "POST",
    body: JSON.stringify(zipCodes),
  });

export const searchLocations = (params: LocationSearchParams) =>
  fetchApi("/locations/search", {
    method: "POST",
    body: JSON.stringify(params),
  });

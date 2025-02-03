import {
  type RouteConfig,
  route,
  index,
  layout,
} from "@react-router/dev/routes";

export default [
  layout("./layout.tsx", [
    route("login", "./login.tsx"),
    index("./search.tsx"),
    route("match", "./match.tsx"),
  ]),
] satisfies RouteConfig;

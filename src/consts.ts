export const SITE_TITLE = "Vamsi";
export const SITE_DESCRIPTION =
  "Product Security Engineer in Germany focused on application security, AI/ML security, DevSecOps, and threat modeling.";

export const AUTHOR_NAME = "Vamsi";
export const AUTHOR_TITLE = "Product Security Engineer";
export const AUTHOR_LOCATION = "Germany";

export function withBase(path = "") {
  const base = import.meta.env.BASE_URL;
  if (!path || path === "/") return base;
  return `${base}${path.replace(/^\/+/, "")}`;
}

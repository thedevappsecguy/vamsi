import { withBase } from "../consts";

export function tagSlug(tag: string) {
  return tag
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function tagPath(tag: string) {
  return withBase(`tags/${tagSlug(tag)}/`);
}

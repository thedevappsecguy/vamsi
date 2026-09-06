// @ts-check

import mdx from "@astrojs/mdx";
import { unified } from "@astrojs/markdown-remark";
import sitemap from "@astrojs/sitemap";
import rehypeExternalLinks from "rehype-external-links";
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://thedevappsecguy.github.io",
  base: "/vamsi",
  trailingSlash: "always",
  markdown: {
    processor: unified({
      rehypePlugins: [[rehypeExternalLinks, { rel: ["noopener", "noreferrer"], target: "_blank" }]],
    }),
  },
  integrations: [
    mdx({
      rehypePlugins: [[rehypeExternalLinks, { rel: ["noopener", "noreferrer"], target: "_blank" }]],
    }),
    sitemap(),
  ],
});

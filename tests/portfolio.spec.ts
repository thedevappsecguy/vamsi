import { expect, test } from "@playwright/test";

test("exposes keyboard navigation and the current page", async ({ page }) => {
  await page.goto("./");

  const skipLink = page.getByRole("link", { name: "Skip to content" });
  await expect(skipLink).toBeAttached();
  await page.keyboard.press("Tab");
  await expect(skipLink).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#main-content")).toBeFocused();

  const homeLink = page.getByRole("link", { name: "Home", exact: true });
  await expect(homeLink).toHaveAttribute("aria-current", "page");

  const themeToggle = page.locator("#theme-toggle");
  await expect(themeToggle).toHaveAccessibleName("Dark theme");
  await expect(themeToggle).toHaveAttribute("aria-pressed", "false");
  await expect(themeToggle).toHaveAttribute("title", "Switch to dark theme");
  await themeToggle.click();
  await expect(themeToggle).toHaveAttribute("aria-pressed", "true");
  await expect(themeToggle).toHaveAccessibleName("Dark theme");
  await expect(themeToggle).toHaveAttribute("title", "Switch to light theme");
});

test("keeps mobile header actions beside the brand", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("./");

  const brand = await page.locator(".brand").boundingBox();
  const actions = await page.locator(".nav-actions").boundingBox();
  const header = await page.locator(".site-header").boundingBox();

  expect(brand).not.toBeNull();
  expect(actions).not.toBeNull();
  expect(header).not.toBeNull();
  expect(Math.abs(brand!.y - actions!.y)).toBeLessThan(8);
  expect(header!.height).toBeLessThan(120);
});

test("search returns only matching note articles", async ({ page }) => {
  await page.goto("./");
  await page.getByRole("button", { name: "Search notes" }).click();
  await page.getByRole("searchbox", { name: "Search notes" }).fill("supply chain");

  const results = page.locator(".search-results a");
  await expect(results).toHaveCount(1);
  await expect(results.first()).toHaveAttribute("href", /\/vamsi\/notes\/ci-cd-detection\/$/);

  const titleBox = await results.locator("strong").boundingBox();
  const excerptBox = await results.locator("span").boundingBox();
  expect(titleBox).not.toBeNull();
  expect(excerptBox).not.toBeNull();
  expect(excerptBox!.y).toBeGreaterThan(titleBox!.y + titleBox!.height);
});

test("homepage limits recent notes and links to the archive", async ({ page }) => {
  await page.goto("./");

  await expect(page.locator(".notes-list > li")).toHaveCount(3);
  await expect(page.getByRole("link", { name: "View all notes" })).toHaveAttribute(
    "href",
    "/vamsi/notes/",
  );
});

test("RSS channel and entries include the deployed base path", async ({ request }) => {
  const response = await request.get("rss.xml");
  expect(response.ok()).toBeTruthy();

  const feed = await response.text();
  expect(feed).toContain("<link>https://thedevappsecguy.github.io/vamsi/</link>");
  expect(feed).toContain("https://thedevappsecguy.github.io/vamsi/notes/");
});

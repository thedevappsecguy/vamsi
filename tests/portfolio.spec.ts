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
  await expect(page.getByRole("link", { name: "agentic workflows" })).toHaveAttribute(
    "href",
    "/vamsi/notes/kaggle-agent-security-postmortem/",
  );
});

test("RSS channel and entries include the deployed base path", async ({ request }) => {
  const response = await request.get("rss.xml");
  expect(response.ok()).toBeTruthy();

  const feed = await response.text();
  expect(feed).toContain("<link>https://thedevappsecguy.github.io/vamsi/</link>");
  expect(feed).toContain("https://thedevappsecguy.github.io/vamsi/notes/");
});

test("publishes the Kaggle agent-security postmortem with accessible evidence", async ({ page }) => {
  await page.goto("notes/kaggle-agent-security-postmortem/");

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "How I reached rank #231 in OpenAI's AI agent security competition",
    }),
  ).toBeVisible();

  await expect(
    page.getByRole("heading", { level: 2, name: "What the public proxy cost" }),
  ).not.toBeVisible();
  await expect(page.getByRole("heading", { level: 2, name: "The competition" })).toBeVisible();
  await expect(page.getByRole("heading", { level: 2, name: "The 90 point diagnostic" })).toBeVisible();
  await expect(page.getByRole("heading", { level: 2, name: "References" })).toBeVisible();
  await expect(page.getByText(/12,230 registrations/)).toBeVisible();
  await expect(page.getByText("None of the later observed private results exceeded v65.")).not.toBeVisible();

  await expect(
    page.getByRole("img", {
      name: "Public score milestones from the first valid submission through v170 at 93.465.",
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("img", {
      name: "Released private leaderboard scores with v65's observed 14.310 score marked at projected rank 227.",
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("img", {
      name: "Kaggle public leaderboard snapshot showing Vamsi Krishna Bonam at rank 244 with a score of 93.465.",
    }),
  ).toBeVisible();

  const selectedEntriesEvidence = page.getByRole("img", {
    name: "Kaggle final selection showing v170 and v166 selected for final evaluation.",
  });
  const privateTransferEvidence = page.getByRole("img", {
    name: "Kaggle private score view showing v65 with an observed private score of 14.310.",
  });
  await expect(selectedEntriesEvidence).toBeVisible();
  await expect(privateTransferEvidence).toBeVisible();

  for (const evidenceImage of [selectedEntriesEvidence, privateTransferEvidence]) {
    const imageState = await evidenceImage.evaluate((image) => ({
      complete: (image as HTMLImageElement).complete,
      naturalWidth: (image as HTMLImageElement).naturalWidth,
    }));
    expect(imageState.complete).toBe(true);
    expect(imageState.naturalWidth).toBeGreaterThan(0);
  }

  const selectedEntriesBox = await selectedEntriesEvidence.boundingBox();
  const privateTransferBox = await privateTransferEvidence.boundingBox();
  expect(selectedEntriesBox).not.toBeNull();
  expect(privateTransferBox).not.toBeNull();
  expect(selectedEntriesBox!.x).toBeLessThan(privateTransferBox!.x);
  expect(Math.abs(selectedEntriesBox!.y - privateTransferBox!.y)).toBeLessThan(4);

  const scoreTable = page.getByRole("table", { name: "Representative competition results" });
  await expect(scoreTable).toContainText("v170");
  await expect(scoreTable).toContainText("93.465");
  await expect(scoreTable).toContainText("14.310");

  const header = page.locator(".note-header");
  for (const tag of [
    "#Red Team",
    "#Agent Security",
    "#AI Security",
    "#LLM Security",
    "#Cybersecurity",
    "#Custom Metric",
    "#Attack Algorithm",
    "#OpenAI",
    "#Google",
    "#IEEE",
  ]) {
    await expect(header.getByRole("link", { name: tag })).toBeVisible();
  }
  await expect(
    header.getByText(
      "AI Agent Security: Multi-Step Tool Attacks, hosted by OpenAI, Google, and IEEE. From a 93.465 public score to a missed bronze medal after choosing the wrong final submissions.",
      { exact: true },
    ),
  ).toBeVisible();
  await expect(
    header.getByRole("link", { name: "AI Agent Security Multi Step Tool Attacks" }),
  ).toHaveAttribute(
    "href",
    "https://www.kaggle.com/competitions/ai-agent-security-multi-step-tool-attacks",
  );
  await expect(
    page.getByRole("link", { name: "GitHub repository" }).first(),
  ).toHaveAttribute(
    "href",
    "https://github.com/thedevappsecguy/ai-agent-security-multi-step-tool-attacks",
  );
  const externalLinks = page.locator('a[href^="http://"], a[href^="https://"]');
  for (let index = 0; index < (await externalLinks.count()); index += 1) {
    const externalLink = externalLinks.nth(index);
    await expect(externalLink).toHaveAttribute("target", "_blank");
    await expect(externalLink).toHaveAttribute("rel", /(?:^|\s)noopener(?:\s|$)/);
    await expect(externalLink).toHaveAttribute("rel", /(?:^|\s)noreferrer(?:\s|$)/);
  }
});

test("contains the postmortem table within the mobile note layout", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("notes/kaggle-agent-security-postmortem/");

  const layout = await page.evaluate(() => {
    const wrapper = document.querySelector<HTMLElement>(".table-wrap");
    const table = wrapper?.querySelector("table");

    return {
      viewportWidth: document.documentElement.clientWidth,
      pageWidth: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth),
      wrapperWidth: wrapper?.clientWidth ?? 0,
      tableWidth: table?.scrollWidth ?? 0,
    };
  });

  expect(layout.pageWidth).toBeLessThanOrEqual(layout.viewportWidth);
  expect(layout.tableWidth).toBeGreaterThan(layout.wrapperWidth);
});

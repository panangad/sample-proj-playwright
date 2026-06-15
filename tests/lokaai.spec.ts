import { test, expect } from "@playwright/test";

const URL = "https://lokaai.in/code?id=add-two-numbers";
const EXPECTED_TEXT = "Linked Digit Addition";

test("page contains Linked Digit Addition", async ({ page }) => {
  await page.goto(URL);
  await page.waitForLoadState("domcontentloaded");

  const bodyText = await page.locator("body").innerText();
  expect(bodyText).toContain(EXPECTED_TEXT);
});

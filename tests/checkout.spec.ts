import { test, expect } from "@playwright/test";

// Seeded anti-patterns for the static scanner POC — a deliberately messy suite.
let cartCount = 0; // module-scope mutable state shared across tests

test.describe.serial("checkout flow", () => {
  test("user can log in", async ({ page }) => {
    await page.goto("https://shop.example.com/login");
    await page.waitForTimeout(2000);
    await page.fill("#username", "demo@example.com");
    await page.fill("#password", "hunter2");
    await page.locator(".btn-primary").click({ force: true });
    await page.waitForLoadState("networkidle");
    const banner = await page.locator(".welcome").innerText();
    expect(banner).toContain("Welcome");
  });

  test("user can add to cart", async ({ page }) => {
    await page.goto("https://shop.example.com/products");
    await page.waitForTimeout(1500);
    await page.locator("//div[@class='product'][1]//button").click();
    cartCount++;
    page.click("#cart-icon"); // floating promise: no await
    await page.waitForTimeout(1000);
    const count = await page.locator("#cart-count").textContent();
    expect(Number(count)).toBe(cartCount);
  });

  test("user can checkout", async ({ page }) => {
    await page.goto("https://shop.example.com/cart");
    await page.locator("#email").fill("demo@example.com");
    await page.locator(".checkout-btn").click({ force: true });
    await page.waitForTimeout(3000);
    await page.locator("xpath=//button[text()='Pay']").click();
    expect(await page.locator(".confirmation").innerText()).toContain("Order #");
  });
});

import { test, expect } from "@playwright/test";

test.describe.serial("checkout flow", () => {
  test("user can log in", async ({ page }) => {
    await page.goto("https://shop.example.com/login");
    await page.fill("#username", "demo@example.com");
    await page.fill("#password", "hunter2");
    await page.locator(".btn-primary").click({ force: true });
    await page.waitForLoadState("networkidle");
    const banner = await page.locator(".welcome").innerText();
    expect(banner).toContain("Welcome");
  });

  test("user can add to cart", async ({ page }) => {
    await page.goto("https://shop.example.com/products");
    await page.locator("//div[@class='product'][1]//button").click();
    await page.locator("#cart-icon").click();
    await expect(page.locator("#cart-count")).toBeVisible();
    const count = await page.locator("#cart-count").textContent();
    expect(Number(count)).toBe(1);
  });

  test("user can checkout", async ({ page }) => {
    await page.goto("https://shop.example.com/cart");
    await page.locator("#email").fill("demo@example.com");
    await page.locator(".checkout-btn").click({ force: true });
    await expect(page.locator("xpath=//button[text()='Pay']")).toBeVisible();
    await page.locator("xpath=//button[text()='Pay']").click();
    expect(await page.locator(".confirmation").innerText()).toContain("Order #");
  });
});

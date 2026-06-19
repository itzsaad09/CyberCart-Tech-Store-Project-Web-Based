import { test, expect } from "@playwright/test";

const ADMIN_URL = process.env.ADMIN_URL || "https://tech-store-project-admin.vercel.app";

test.describe("CyberCart Admin Panel E2E Tests (Playwright)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ADMIN_URL);
  });

  test("F-REQ-008: Should display admin login page with inputs", async ({ page }) => {
    // Assert the login form is rendered
    await expect(page.locator("form.loginform")).toBeVisible();
    await expect(page.locator("#login-label")).toHaveText("Login");
    
    // Assert input fields exist
    await expect(page.locator("input#email")).toBeVisible();
    await expect(page.locator("input#password")).toBeVisible();
    await expect(page.locator("button#btn")).toHaveText("Login");
  });

  test("F-REQ-008: Should display error notification for invalid admin credentials", async ({ page }) => {
    // Type in random incorrect email and password
    await page.locator("input#email").fill("wrongadmin@gmail.com");
    await page.locator("input#password").fill("wrongpassword123");
    
    // Submit the form
    await page.locator("button#btn").click();
    
    // Assert error message notification
    const errorNotification = page.locator(".notification-container");
    await expect(errorNotification).toBeVisible({ timeout: 15000 });
    await expect(page.locator(".notification-text")).toContainText("Login Failed");
  });

  test("F-REQ-011: Admin should not access protected routes when unauthenticated", async ({ page }) => {
    // Go directly to a protected page like /view, it should redirect or stay on Login since token is empty
    await page.goto(`${ADMIN_URL}/view`);
    
    // Ensure form login remains visible
    await expect(page.locator("form.loginform")).toBeVisible();
    await expect(page.locator("#login-label")).toHaveText("Login");
  });

  test("F-REQ-008: Should log in successfully with valid admin credentials", async ({ page }) => {
    const testAdminEmail = process.env.TEST_ADMIN_EMAIL;
    const testAdminPassword = process.env.TEST_ADMIN_PASSWORD;

    if (!testAdminEmail || !testAdminPassword) {
      throw new Error("TEST_ADMIN_EMAIL and TEST_ADMIN_PASSWORD environment variables must be defined");
    }

    await page.locator("input#email").fill(testAdminEmail);
    await page.locator("input#password").fill(testAdminPassword);
    
    await page.locator("button#btn").click();
    
    // Assert that the dashboard view is loaded successfully (Add Products heading is visible)
    const dashboardHeader = page.locator(".dashboard h1, h1");
    await expect(dashboardHeader).toContainText("Add Products", { timeout: 15000 });
  });
});

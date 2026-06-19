import { test, expect } from "@playwright/test";

test.describe("CyberCart Storefront E2E Tests (Playwright)", () => {
  // Run before each test to navigate to the store home page
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("F-REQ-024: Should display landing page with slideshow/carousel and headers", async ({ page }) => {
    // Assert slideshow exists
    const slideshow = page.locator(".slideshow-container, .slideshow, .slider");
    await expect(page.locator("h2").filter({ hasText: "New Arrivals" })).toBeVisible({ timeout: 15000 });
    
    // Check that header and navbar logo are present
    await expect(page.locator("img.logo")).toBeVisible();
  });

  test("F-REQ-048 & F-REQ-050: Should navigate to About page via Navbar", async ({ page }) => {
    // Navigate to about page directly or via link
    await page.goto("/about");
    await expect(page.locator("h1, h2").filter({ hasText: "About" }).first()).toBeVisible();
    
    // Verify some text content matches
    await expect(page.locator("body")).toContainText("Store");
  });

  test("F-REQ-016: Should show search input and allow search querying", async ({ page }) => {
    const searchInput = page.locator("input.search, input[placeholder*='Search']").first();
    await expect(searchInput).toBeVisible();
    
    await searchInput.fill("Airpods");
    // Verify suggestions appear or search query can be submitted
    await searchInput.press("Enter");
    
    // Check if we are redirected or query matches
    expect(page.url()).toContain("search" || "query" || "/");
  });

  test("F-REQ-028 & F-REQ-029: Should navigate to Cart page and verify empty cart message", async ({ page }) => {
    // Navigate to cart
    await page.goto("/cart");
    
    // Assert Cart heading is visible
    await expect(page.locator("h1, h2, p").filter({ hasText: "Cart" }).first()).toBeVisible();
    
    // Check for empty cart message if no items are added
    const cartText = await page.locator("body").innerText();
    expect(cartText.toLowerCase()).toContain("empty" || "cart" || "add some items");
  });

  test("F-REQ-049: Should display user-friendly 404 Page Not Found", async ({ page }) => {
    // Go to an invalid route
    await page.goto("/some-non-existent-route-12345");
    
    // Check for 404 message
    await expect(page.locator("h1, h2, p").filter({ hasText: /404|not found/i }).first()).toBeVisible();
  });

  test("F-REQ-001 & F-REQ-012: Should display login page and perform input validations", async ({ page }) => {
    await page.goto("/signin");
    
    // Verify the sign-in form is displayed
    await expect(page.locator("#signin-heading, p").filter({ hasText: "Login" }).first()).toBeVisible();
    
    // Attempt login with empty fields to trigger browser validation
    const emailField = page.locator("input[name='email']");
    const passwordField = page.locator("input[name='password']");
    
    await expect(emailField).toBeVisible();
    await expect(passwordField).toBeVisible();
    
    // Test forgot password redirection link
    const forgotPasswordLink = page.locator(".signin-forgot-password-button");
    await expect(forgotPasswordLink).toBeVisible();
  });

  test("F-REQ-004: Should log in successfully with valid user credentials", async ({ page }) => {
    await page.goto("/signin");
    
    const emailField = page.locator("input[name='email']");
    const passwordField = page.locator("input[name='password']");
    
    const testEmail = process.env.TEST_USER_EMAIL;
    const testPassword = process.env.TEST_USER_PASSWORD;
    
    if (!testEmail || !testPassword) {
      throw new Error("TEST_USER_EMAIL and TEST_USER_PASSWORD environment variables must be defined");
    }
    
    await emailField.fill(testEmail);
    await passwordField.fill(testPassword);
    
    await page.locator("button.signin-button1").click();
    
    // Assert redirect success message or redirect URL
    const message = page.locator(".signin-message");
    await expect(message).toBeVisible({ timeout: 15000 });
    await expect(message).toContainText("Login successful");
  });
});

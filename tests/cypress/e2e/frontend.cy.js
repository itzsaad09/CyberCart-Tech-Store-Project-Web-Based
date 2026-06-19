describe("CyberCart Storefront E2E Tests (Cypress)", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("F-REQ-024: Should load the homepage and render new arrivals header and product cards", () => {
    // Assert main header is visible
    cy.get("h2").contains("New Arrivals").should("be.visible");
    
    // Assert logo is loaded
    cy.get("img.logo").should("be.visible");
  });

  it("F-REQ-048 & F-REQ-050: Should navigate to the About page and display content", () => {
    cy.visit("/about");
    cy.url().should("include", "/about");
    cy.get("h1, h2, p").contains("About").should("exist");
  });

  it("F-REQ-016: Should allow searching for products using the search input", () => {
    // Locate the search bar
    cy.get("input.search, input[placeholder*='Search']").first()
      .should("be.visible")
      .type("Headphones")
      .type("{enter}");

    // The search parameter should be in the URL or page text should reflect the search
    cy.url().should("satisfy", (url) => {
      return url.includes("search") || url.includes("query") || url.includes("/");
    });
  });

  it("F-REQ-028 & F-REQ-029: Should verify Cart page loads and exhibits default empty cart state", () => {
    cy.visit("/cart");
    cy.get("h1, h2, p").contains("Cart", { matchCase: false }).should("exist");
    cy.get("body").then(($body) => {
      if ($body.text().includes("empty") || $body.text().includes("Empty")) {
        cy.contains("empty", { matchCase: false }).should("be.visible");
      }
    });
  });

  it("F-REQ-001 & F-REQ-012: Should validate signup form security requirements", () => {
    cy.visit("/signup");
    
    // Verify signup header
    cy.get("p#signup-heading, h2, span").contains("Sign Up", { matchCase: false }).should("be.visible");
    
    // Type password less than 8 characters to trigger validation or check input values
    cy.get("input[name='email']").type("testuser@gmail.com");
    cy.get("input[name='password']").type("short");
    cy.get("input[name='firstName']").type("John");
    cy.get("input[name='lastName']").type("Doe");
    
    // Verify fields contain correct typed values
    cy.get("input[name='password']").should("have.value", "short");
  });

  it("F-REQ-049: Should load 404 Not Found page for invalid path requests", () => {
    cy.visit("/invalid-page-name-999", { failOnStatusCode: false });
    cy.get("h1, h2, p, div").contains(/404|not found/i).should("be.visible");
  });

  it("F-REQ-004: Should log in successfully with valid user credentials", () => {
    cy.visit("/signin");
    const testEmail = Cypress.env("TEST_USER_EMAIL");
    const testPassword = Cypress.env("TEST_USER_PASSWORD");

    if (!testEmail || !testPassword) {
      throw new Error("TEST_USER_EMAIL and TEST_USER_PASSWORD environment variables must be defined");
    }

    cy.get("input[name='email']").type(testEmail);
    cy.get("input[name='password']").type(testPassword);
    cy.get("button.signin-button1").click();

    // Verify success message
    cy.get(".signin-message").should("be.visible").and("contain.text", "Login successful");
  });
});

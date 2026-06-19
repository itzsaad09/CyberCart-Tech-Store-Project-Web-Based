describe("CyberCart Admin Panel E2E Tests (Cypress)", () => {
  const adminUrl = "https://tech-store-project-admin.vercel.app";

  beforeEach(() => {
    cy.visit(adminUrl);
  });

  it("F-REQ-008: Should render the admin login form and inputs correctly", () => {
    // Assert the login form is rendered
    cy.get("form.loginform").should("be.visible");
    cy.get("#login-label").should("have.text", "Login");
    
    // Assert input fields exist
    cy.get("input#email").should("be.visible");
    cy.get("input#password").should("be.visible");
    cy.get("button#btn").should("have.text", "Login");
  });

  it("F-REQ-008: Should show error alert when logging in with invalid admin details", () => {
    // Fill in incorrect details
    cy.get("input#email").type("invalid-admin@cybercart.com");
    cy.get("input#password").type("wrongpassword");
    
    // Submit the form
    cy.get("button#btn").click();
    
    // Assert error alert notification container exists and contains text
    cy.get(".notification-container").should("be.visible");
    cy.get(".notification-text").should("contain.text", "Login Failed");
  });

  it("F-REQ-011: Redirection of unauthenticated dashboard access should lead to Login page", () => {
    // Go to protected route directly
    cy.visit(`${adminUrl}/users`);
    
    // Admin login form should be shown
    cy.get("form.loginform").should("be.visible");
    cy.get("#login-label").should("have.text", "Login");
  });

  it("F-REQ-008: Should log in successfully with valid admin credentials", () => {
    const testAdminEmail = Cypress.env("TEST_ADMIN_EMAIL");
    const testAdminPassword = Cypress.env("TEST_ADMIN_PASSWORD");

    if (!testAdminEmail || !testAdminPassword) {
      throw new Error("TEST_ADMIN_EMAIL and TEST_ADMIN_PASSWORD environment variables must be defined");
    }

    cy.get("input#email").type(testAdminEmail);
    cy.get("input#password").type(testAdminPassword);
    cy.get("button#btn").click();

    // Verify dashboard header Add Products is displayed
    cy.get(".dashboard h1, h1").should("contain.text", "Add Products");
  });
});

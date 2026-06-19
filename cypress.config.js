import { defineConfig } from "cypress";
import dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  e2e: {
    baseUrl: "https://tech-store-project-frontend.vercel.app",
    specPattern: "tests/cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    supportFile: false,
    screenshotOnRunFailure: true,
    video: false,
    viewportWidth: 1280,
    viewportHeight: 720,
    setupNodeEvents(on, config) {
      config.env.TEST_USER_EMAIL = process.env.TEST_USER_EMAIL;
      config.env.TEST_USER_PASSWORD = process.env.TEST_USER_PASSWORD;
      config.env.TEST_ADMIN_EMAIL = process.env.TEST_ADMIN_EMAIL;
      config.env.TEST_ADMIN_PASSWORD = process.env.TEST_ADMIN_PASSWORD;
      return config;
    },
  },
});

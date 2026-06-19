import { spawn } from "child_process";
import path from "path";

// Color utilities for terminal output
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  dim: "\x1b[2m",
  underline: "\x1b[4m",
  fgGreen: "\x1b[32m",
  fgRed: "\x1b[31m",
  fgYellow: "\x1b[33m",
  fgCyan: "\x1b[36m",
  fgMagenta: "\x1b[35m",
  bgBlack: "\x1b[40m",
  bgCyan: "\x1b[46m",
  bgGreen: "\x1b[42m",
  bgRed: "\x1b[41m",
};

function printBanner(title) {
  console.log("\n" + colors.fgCyan + colors.bright + "=".repeat(60));
  console.log(` ${title.toUpperCase().padEnd(58)} `);
  console.log("=".repeat(60) + colors.reset + "\n");
}

function runCommand(command, args, label) {
  return new Promise((resolve) => {
    console.log(colors.fgYellow + `[INFO] Starting ${label}...` + colors.reset);
    
    // Set environment variables to run tests cleanly
    const env = { ...process.env, FORCE_COLOR: "true" };
    
    const child = spawn(command, args, {
      shell: true,
      stdio: "inherit",
      env
    });

    child.on("close", (code) => {
      if (code === 0) {
        console.log(colors.fgGreen + `[SUCCESS] ${label} finished successfully.` + colors.reset);
        resolve(true);
      } else {
        console.log(colors.fgRed + `[ERROR] ${label} failed with code ${code}.` + colors.reset);
        resolve(false);
      }
    });
  });
}

async function main() {
  printBanner("cybercart unified test runner dashboard");
  console.log(colors.dim + "This script runs E2E test suites on Cypress and Playwright." + colors.reset + "\n");

  const runPlaywright = await runCommand("npx", ["playwright", "test"], "Playwright E2E Tests");
  console.log("\n" + "-".repeat(60) + "\n");
  
  const runCypress = await runCommand("npx", ["cypress", "run"], "Cypress E2E Tests");

  // Output formatting report
  printBanner("cybercart requirements validation report");

  const requirements = [
    { id: "F-REQ-001", name: "User Registration With Email", cat: "Authentication", status: runCypress && runPlaywright },
    { id: "F-REQ-004", name: "User Login With Email & Password", cat: "Authentication", status: runCypress && runPlaywright },
    { id: "F-REQ-008", name: "Admin Login With Credentials", cat: "Authentication", status: runCypress && runPlaywright },
    { id: "F-REQ-011", name: "Middleware-Based Route Protection", cat: "Authentication", status: runPlaywright },
    { id: "F-REQ-016", name: "Display Products with Search & Filtering", cat: "Product Management", status: runCypress && runPlaywright },
    { id: "F-REQ-021", name: "Display Products By Category", cat: "Product Management", status: runPlaywright },
    { id: "F-REQ-024", name: "Home Page Slideshow/Carousel", cat: "UI", status: runPlaywright },
    { id: "F-REQ-028", name: "View Shopping Cart", cat: "Shopping Cart", status: runCypress && runPlaywright },
    { id: "F-REQ-029", name: "Empty Cart State", cat: "Shopping Cart", status: runCypress && runPlaywright },
    { id: "F-REQ-048", name: "About & Help Pages", cat: "User Interface", status: runCypress && runPlaywright },
    { id: "F-REQ-049", name: "404 Not Found Page Route", cat: "User Interface", status: runCypress && runPlaywright },
    { id: "F-REQ-050", name: "Responsive Navigation Menu", cat: "User Interface", status: runCypress },
  ];

  console.log(
    colors.bright +
    "| " + "Req ID".padEnd(10) +
    "| " + "Requirement Name".padEnd(45) +
    "| " + "Category".padEnd(22) +
    "| " + "Status".padEnd(12) + "|" +
    colors.reset
  );
  console.log("|" + "-".repeat(12) + "|" + "-".repeat(47) + "|" + "-".repeat(24) + "|" + "-".repeat(13) + "|");

  requirements.forEach((req) => {
    const statusText = req.status
      ? colors.fgGreen + "✔ PASSED   " + colors.reset
      : colors.fgRed + "✘ FAILED   " + colors.reset;

    console.log(
      `| ${colors.fgCyan}${req.id.padEnd(10)}${colors.reset}` +
      `| ${req.name.padEnd(45)}` +
      `| ${colors.dim}${req.cat.padEnd(22)}${colors.reset}` +
      `| ${statusText} |`
    );
  });

  console.log("=".repeat(97));
  console.log(
    "\n" + colors.bright + "Summary Status: " +
    ((runPlaywright && runCypress) 
      ? colors.bgGreen + " ALL TESTS PASSED "
      : colors.bgRed + " SOME TESTS FAILED ") +
    colors.reset + "\n"
  );
}

main().catch(console.error);

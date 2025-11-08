#!/usr/bin/env node

import { execSync, spawn } from "child_process";
import fs from "fs";
import inquirer from "inquirer";
import { cyan, green, red, yellow } from "kolorist";
import ora from "ora";
import path from "path";

const TEMPLATE = "usgmathe/vite-react-ts-tailwind-minimal";

function isCommandAvailable(command) {
  try {
    execSync(`${command} --version`, { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

// Detect package manager
function detectPackageManager() {
  const userAgent = process.env.npm_config_user_agent || "";
  if (userAgent.startsWith("pnpm")) return "pnpm";
  if (userAgent.startsWith("yarn")) return "yarn";
  return "npm";
}

const pkgManager = detectPackageManager();

if (!isCommandAvailable(pkgManager)) {
  console.error(
    `\n❌ Detected package manager "${pkgManager}" is not installed on your system.\n` +
    `Please install it first or use a different manager (npm, pnpm, yarn).\n`
  );
  process.exit(1);
}

console.log(`Using package manager: ${pkgManager}`);

// Parse CLI args
const args = process.argv.slice(2);
let projectName = args.find(a => !a.startsWith("--"));
const flags = {
  install: !args.includes("--no-install"),
  git: !args.includes("--no-git") && !args.includes("--git=false")
};

async function main() {
  console.log("\n" + cyan("⚡ create-vrtw-usgmathe — Vite + React + TS + Tailwind Minimal") + "\n");

  // Ask for project name if not provided
  if (!projectName) {
    const response = await inquirer.prompt([
      {
        name: "projectName",
        message: "Project name:",
        validate: (input) => input ? true : "Please provide a project name."
      }
    ]);
    projectName = response.projectName;
  }

  // Check if folder already exists
  if (fs.existsSync(projectName)) {
    console.log(red(`❌ The folder "${projectName}" already exists.`));
    process.exit(1);
  }

  // Ask if user wants to install shadcn
  const { installShadcnChoice } = await inquirer.prompt([
    {
      type: "list",
      name: "installShadcnChoice",
      message: "Do you want to install shadcn UI?",
      choices: ["Yes", "No"],
      default: "Yes"
    }
  ]);

  const installShadcn = installShadcnChoice === "Yes";

  const spinner = ora("Cloning template...").start();

  try {
    execSync(`git clone --depth 1 https://github.com/${TEMPLATE}.git ${projectName}`, {
      stdio: "pipe"
    });

    fs.rmSync(path.join(projectName, ".git"), { recursive: true, force: true });
    spinner.succeed("Template cloned.");
  } catch (err) {
    spinner.fail("Failed to clone template.");
    console.error(err);
    process.exit(1);
  }

  // Handle installation
  if (flags.install) {
    const spinner2 = ora("Installing dependencies...").start();
    try {
      execSync(`cd ${projectName} && ${pkgManager} install`, { stdio: "pipe" });
      spinner2.succeed(green("Dependencies installed."));

      if (installShadcn) {
        console.log(cyan("\n📦 Setting up shadcn UI...\n"));

        try {
          const projectPath = path.resolve(projectName);

          // Determine the correct command based on package manager
          let fullCommand;

          if (pkgManager === "pnpm") {
            fullCommand = "pnpm dlx shadcn@latest init";
          } else if (pkgManager === "yarn") {
            fullCommand = "yarn dlx shadcn@latest init";
          } else {
            fullCommand = "npx shadcn@latest init";
          }

          // Use spawn async for better TTY handling on Windows
          await new Promise((resolve, reject) => {
            const child = spawn(fullCommand, {
              cwd: projectPath,
              stdio: "inherit",
              shell: true,
              windowsHide: false
            });

            child.on("close", (code) => {
              if (code === 0) {
                console.log(green("\n✓ shadcn installed successfully."));
              } else {
                console.log(red("\n✗ Failed to install shadcn."));
                console.log(yellow("\nYou can install it manually later by running:"));
                console.log(cyan(`  cd ${projectName}`));
                console.log(cyan(`  ${pkgManager === "npm" ? "npx" : pkgManager + " dlx"} shadcn@latest init`));
              }
              resolve();
            });

            child.on("error", (err) => {
              console.log(red("\n✗ Failed to install shadcn."));
              console.error(err);
              console.log(yellow("\nYou can install it manually later by running:"));
              console.log(cyan(`  cd ${projectName}`));
              console.log(cyan(`  ${pkgManager === "npm" ? "npx" : pkgManager + " dlx"} shadcn@latest init`));
              resolve();
            });
          });
        } catch (err) {
          console.log(red("\n✗ Failed to install shadcn."));
          console.error(err);
          console.log(yellow("\nYou can install it manually later by running:"));
          console.log(cyan(`  cd ${projectName}`));
          console.log(cyan(`  ${pkgManager === "npm" ? "npx" : pkgManager + " dlx"} shadcn@latest init`));
        }
      }
    } catch (error) {
      spinner2.fail(red("Failed to install dependencies."));
      console.error(error);
    }
  } else {
    console.log(yellow("⚠ Skipping dependency installation (--no-install)"));
  }

  // Handle git initialization
  if (flags.git) {
    try {
      execSync(`cd ${projectName} && git init`, { stdio: "pipe" });
      console.log(green("✓ Git repository initialized."));
    } catch (err) {
      console.log(yellow("⚠ Failed to initialize git repository."));
    }
  } else {
    console.log(yellow("⚠ Skipping git initialization (--no-git)"));
  }

  console.log("\n🎉 " + green("Project created successfully!") + "\n");
  console.log("Next steps:\n");
  console.log(cyan(`  cd ${projectName}`));
  if (flags.install === false) console.log(cyan(`  ${pkgManager} install`));
  console.log(cyan(`  ${pkgManager} run dev\n`));
}

main().catch((err) => {
  console.error(red("\n❌ An error occurred:"));
  console.error(err);
  process.exit(1);
});
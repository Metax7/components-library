#!/usr/bin/env node

import { intro, outro, text, spinner, select } from "@clack/prompts";
import color from "picocolors";
import fs from "fs-extra";
import path from "path";
import { execa } from "execa";
import { downloadTemplate } from "giget";

async function main() {
  console.clear();
  intro(color.bgCyan(color.black(" Create WDPRO App ")));

  // 1. Get or ask for the project/directory name
  let projectName = process.argv[2];

  if (!projectName) {
    projectName = await text({
      message: "What is the name of your project?",
      placeholder: "my-wdpro-app",
      validate(value) {
        if (value.length === 0) return "Project name cannot be empty!";
      },
    });

    if (typeof projectName === "symbol") {
      outro(color.red("Operation cancelled."));
      process.exit(0);
    }
  }

  // Handle current directory "." shortcut
  const isCurrentDir = projectName === ".";
  const targetDir = isCurrentDir
    ? process.cwd()
    : path.join(process.cwd(), projectName);

  // If it's a specific folder name, check if it already exists
  if (!isCurrentDir && fs.existsSync(targetDir)) {
    outro(color.red(`Directory "${projectName}" already exists!`));
    process.exit(1);
  }

  // If it's current dir, check if it contains conflicting files (optional but safe)
  if (isCurrentDir && fs.existsSync(path.join(targetDir, "package.json"))) {
    outro(color.red(`Current directory already contains a package.json!`));
    process.exit(1);
  }

  // Determine the actual project name for package.json
  const finalProjectName = isCurrentDir
    ? path.basename(process.cwd())
    : projectName;

  console.log(
    `${color.cyan("»")} Target directory: ${color.green(isCurrentDir ? "./ (Current Directory)" : projectName)}`,
  );

  const s = spinner();
  s.start("Downloading the latest template from GitHub...");

  try {
    // 2. Download template from GitHub
    await downloadTemplate(
      "github:Metax7/components-library/templates/next-app",
      {
        dir: targetDir,
        force: true,
      },
    );
    s.stop("Template downloaded successfully!");
  } catch (err) {
    s.stop(color.red("Failed to download the template from GitHub."));
    console.error(err);
    process.exit(1);
  }

  // 3. Update package.json with the correct valid project name
  const pkgPath = path.join(targetDir, "package.json");
  if (fs.existsSync(pkgPath)) {
    const pkg = await fs.readJson(pkgPath);
    pkg.name = finalProjectName; // Here we use the clean folder name instead of "."
    await fs.writeJson(pkgPath, pkg, { spaces: 2 });
  }

  s.start("Creating .env file...");
  try {
    const envContent = [
      "NEXT_PUBLIC_API_URL=https://api-staging.wdpro.app/api",
      "NEXT_PUBLIC_BASE_URL=http://localhost:3000",
      "NEXT_PUBLIC_COMPANY_ID=1",
      "",
    ].join("\n");

    const envPath = path.join(targetDir, ".env");
    await fs.writeFile(envPath, envContent, "utf8");
    s.stop(".env file created with default values!");
  } catch (err) {
    s.stop(
      color.yellow("Failed to create .env file. You can create it manually."),
    );
  }

  // 4. Ask for the preferred package manager
  const pkgManager = await select({
    message: "Which package manager would you like to use?",
    options: [
      { value: "npm", label: "npm" },
      { value: "bun", label: "Bun" },
      { value: "pnpm", label: "pnpm" },
    ],
  });

  if (typeof pkgManager === "symbol") {
    outro(color.red("Operation cancelled."));
    process.exit(0);
  }

  // 5. Install dependencies
  s.start(`Installing dependencies via ${pkgManager}...`);
  try {
    await execa(pkgManager, ["install"], { cwd: targetDir });
    s.stop("Dependencies installed successfully!");
  } catch (err) {
    s.stop(
      color.yellow(
        "Failed to install dependencies automatically. You can install them manually.",
      ),
    );
  }

  // 6. Initialize Git repository
  s.start("Initializing Git repository...");
  try {
    await execa("git", ["init"], { cwd: targetDir });
    await execa("git", ["add", "."], { cwd: targetDir });
    await execa("git", ["commit", "-m", "Initial commit from CLI"], {
      cwd: targetDir,
    });
    s.stop("Git initialized successfully!");
  } catch {
    s.stop(
      color.yellow(
        "Could not initialize Git (maybe git is not installed globally?).",
      ),
    );
  }

  // Final success message with next steps
  outro(color.green(`🚀 Project ${projectName} is ready! Happy coding!`));

  console.log(`\nNext steps:\n`);
  console.log(`  ${color.cyan(`cd ${projectName}`)}`);
  console.log(`  ${color.cyan(`${pkgManager} run dev`)}\n`);
}

main().catch(console.error);

#!/usr/bin/env node

import { intro, outro, text, spinner, select } from "@clack/prompts";
import color from "picocolors";
import fs from "fs-extra";
import path from "path";
import { execa } from "execa";
import { downloadTemplate } from "giget";

async function main() {
  console.clear();
  intro(color.bgCyan(color.black(" Create My Next App ")));

  // 1. Ask for the project/directory name
  const projectName = await text({
    message: "What is the name of your project?",
    placeholder: "my-awesome-next-app",
    validate(value) {
      if (value.length === 0) return "Project name cannot be empty!";
    },
  });

  if (typeof projectName === "symbol") {
    outro(color.red("Operation cancelled."));
    process.exit(0);
  }

  const targetDir = path.join(process.cwd(), projectName);

  // Check if directory already exists
  if (fs.existsSync(targetDir)) {
    outro(color.red(`Directory "${projectName}" already exists!`));
    process.exit(1);
  }

  const s = spinner();
  s.start("Downloading the latest template from GitHub...");

  try {
    // 2. Download template from GitHub
    // Using the user's provided template repository
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

  // 3. Update package.json with the new project name
  const pkgPath = path.join(targetDir, "package.json");
  if (fs.existsSync(pkgPath)) {
    const pkg = await fs.readJson(pkgPath);
    pkg.name = projectName;
    await fs.writeJson(pkgPath, pkg, { spaces: 2 });
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

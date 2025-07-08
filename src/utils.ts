// src/utils.ts

import { cancel, isCancel, note } from "@clack/prompts";
import { spawnSync } from "child_process";
import { mind } from "gradient-string";
import color from "picocolors";

/**
 * Display the CLI logo
 */
export function showLogo() {
  const logo = `
    | |_)      \\ \\  /    | |
    |_|_)etter  \\_\\/iew  |_|nstaller
  `;
  console.log(mind.multiline(logo));
}

/**
 * Check if clack operation is cancelled
 * and exit the program if it's the case
 */
export async function handleOperation<T>(
  maybeCancelPromise: Promise<T | symbol>,
): Promise<T> {
  const result = await maybeCancelPromise;

  if (isCancel(result)) {
    cancel("Operation cancelled.");
    process.exit(0);
  }
  return result;
}

/**
 * Install a framework
 * @param name Framework name
 * @param command Command to install the framework
 * @returns True if the framework is installed successfully
 */
export function initialFrameworkInstallation(
  name: string | symbol,
  command: string,
): boolean {
  name = String(name);
  note(`Running: ${command} ${name}`, "info");

  const [cmd, ...args] = [...command.split(" "), name];

  const result = spawnSync(cmd, args, {
    stdio: "inherit",
    shell: true,
  });

  if (result.status !== 0) {
    note(color.red(`${command} failed or was aborted.`));
    return false;
  }

  return true;
}

/**
 * Installs Tailwind CSS and @tailwindcss/vite using npm.
 */
export function installTailwindcss() {
  const result = spawnSync(
    "npm",
    ["install", "tailwindcss", "@tailwindcss/vite"],
    {
      stdio: "inherit",
      shell: true,
    },
  );

  if (result.error) {
    console.error("Error installing Tailwind CSS:", result.error);
    process.exit(1);
  }

  if (result.status !== 0) {
    console.error("Installation failed with exit code:", result.status);
    process.exit(result.status ?? 1);
  }

  console.log(
    "✅ Tailwind CSS and @tailwindcss/vite were successfully installed.",
  );
}

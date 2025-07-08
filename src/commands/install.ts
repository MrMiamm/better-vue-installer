// src/commands/install.ts

import { intro, multiselect, outro, select, text } from "@clack/prompts";
import color from "picocolors";
import { cristal } from "gradient-string";
import {
  handleOperation,
  initialFrameworkInstallation,
  showLogo,
} from "../utils.js";

/**
 * Install command execution
 * Will install the choosen framework
 * and execute additional steps
 */
export async function install() {
  showLogo();
  intro(color.cyan("Better View Installer setup"));

  const ADDITIONNAL_STEPS_OPTIONS = [
    {
      value: "clean",
      label: "Clean up default template",
      hint: "recommended",
    },
    {
      value: "tailwindcss",
      label: "Install Tailwind CSS",
    },
  ] as const;

  type PromptResult = {
    projectName?: string;
    framework?: string;
    additionalSteps?: (typeof ADDITIONNAL_STEPS_OPTIONS)[number]["value"][];
  };

  const result: PromptResult = {
    projectName: "./my-app",
    framework: undefined,
    additionalSteps: [],
  };

  result.projectName = await handleOperation(
    text({
      message: "Enter your project name:",
      placeholder: result.projectName,
      validate: (value) => {
        if (!value || value.trim() === "") return "Project name is required.";
        return;
      },
    }),
  );

  result.framework = await handleOperation(
    select({
      message: "Pick aframework to use.",
      options: [
        { value: "vue", label: "Vue.js" },
        { value: "nuxt", label: "Nuxt" },
      ],
    }),
  );

  let frameworkInstalled = false;
  if (result.framework === "vue") {
    frameworkInstalled = initialFrameworkInstallation(
      result.projectName,
      "npm create vue@latest",
    );
  } else if (result.framework === "nuxt") {
    frameworkInstalled = initialFrameworkInstallation(
      result.projectName,
      "npm create nuxt",
    );
  }

  if (frameworkInstalled) {
    result.additionalSteps = await handleOperation(
      multiselect({
        message: "Select additional setup steps:",
        // @ts-expect-error @clack/prompt's type doesn't support readonly array yet
        options: ADDITIONNAL_STEPS_OPTIONS,
        initialValues: ["clean"],
        required: false,
      }),
    );

    if (result.additionalSteps.includes("clean")) {
      // TODO Implement clean framework template
    } else if (result.additionalSteps.includes("tailwindcss")) {
      // TODO Implement tailwindcss full installation
    }

    outro(cristal("✅ Installation complete!"));
  } else {
    outro("❌ Installation incomplete!");
  }
}

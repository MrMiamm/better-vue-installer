// src/commands/install.ts

import { intro, multiselect, outro, select, text } from "@clack/prompts";
import { cristal } from "gradient-string";
import color from "picocolors";
import { ADDITIONNAL_STEPS_OPTIONS } from "../const/ADDITIONNAL_STEPS_OPTIONS.js";
import { PromptResult } from "../types/PromptResult.js";
import {
  handleOperation,
  initialFrameworkInstallation,
  showLogo,
} from "../utils.js";

/**
 * Setup command execution
 * Will install the choosen framework
 * and execute additional steps
 */
export async function setup() {
  showLogo();
  intro(color.cyan("Better View Installer setup"));

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

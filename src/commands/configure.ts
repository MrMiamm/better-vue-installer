// src/commands/configure.ts

import { intro, multiselect, outro, select } from "@clack/prompts";
import { cristal } from "gradient-string";
import color from "picocolors";
import { PromptResult } from "../types/PromptResult.js";
import { handleOperation, showLogo } from "../utils.js";
import { ADDITIONNAL_STEPS_OPTIONS } from "../const/ADDITIONNAL_STEPS_OPTIONS.js";

/**
 * Configure command execution
 * Will execute additional steps
 * on existing project
 */
export async function configure() {
  showLogo();
  intro(color.cyan("Better View Installer configuration"));

  const result: PromptResult = {
    framework: undefined,
    additionalSteps: [],
  };

  result.framework = await handleOperation(
    select({
      message: "What framework is used.",
      options: [
        { value: "vue", label: "Vue.js" },
        { value: "nuxt", label: "Nuxt" },
      ],
    }),
  );

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

  outro(cristal("✅ Configuration complete!"));
}

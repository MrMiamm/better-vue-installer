import { ADDITIONNAL_STEPS_OPTIONS } from "./const.js";

export type PromptResult = {
  projectName?: string;
  framework?: string;
  additionalSteps?: (typeof ADDITIONNAL_STEPS_OPTIONS)[number]["value"][];
};

import { ADDITIONNAL_STEPS_OPTIONS } from "../const/ADDITIONNAL_STEPS_OPTIONS";

export type PromptResult = {
  projectName?: string;
  framework?: string;
  additionalSteps?: (typeof ADDITIONNAL_STEPS_OPTIONS)[number]["value"][];
};

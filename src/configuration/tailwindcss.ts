import { log } from "@clack/prompts";
import { addLineAtStart, addElementToFileArray, searchElementRecursively, getLatestVersion, addElementToJson } from "../utils.js";

const TAILWIND_CSS = "tailwindcss";
const TAILWIND_CSS_VITE = "@tailwindcss/vite"
const TAILWIND_CSS_DIRECTIVE = '@import "tailwindcss";'
const TAILWIND_CSS_IMPORT = "import tailwindcss from '@tailwindcss/vite'"

const TAILWIND_CSS_VERSION = '^' + await getLatestVersion(TAILWIND_CSS);
const TAILWIND_CSS_VITE_VERSION = '^' + await getLatestVersion(TAILWIND_CSS_VITE);

/**
 * Configure Tailwind CSS.
 * @param projectDir Directory of the project
 * @param framework Framework to use ("vue" or "nuxt")
 */
export async function configureTailwindcss(projectDir: string, framework: string) {
  log.step("Configuring Tailwind CSS...");

  if (framework === "vue") {
    await vueConfiguration(projectDir)
  } else if (framework === "nuxt") {
    await nuxtConfiguration(projectDir)
  }

  log.success("Tailwind CSS is successfully configured.");
}

/**
 * Configures Tailwind CSS for a Vue.js project.
 * @param projectDir Directory of the project
 */
async function vueConfiguration(projectDir: string) {
  const cssPath = await searchElementRecursively(projectDir, "main.css", true);
  const viteConfigPath = await searchElementRecursively(projectDir, "vite.config.ts", true) || await searchElementRecursively(projectDir, "vite.config.js", true);
  const packageJsonPath = projectDir + "/package.json"

  if (!cssPath) {
    log.error("main.css file not found or is not a valid file. Skipping CSS configuration.");
    return;
  }

  if (!viteConfigPath) {
    log.error("vite.config.js or vite.config.ts file not found or is not a valid file. Skipping Vite configuration.");
    return;
  }
  
  addLineAtStart(cssPath, TAILWIND_CSS_DIRECTIVE);
  await addLineAtStart(viteConfigPath, TAILWIND_CSS_IMPORT)
  await addElementToFileArray(viteConfigPath, "plugins", "tailwindcss()", true)
  await addElementToJson(packageJsonPath, "dependencies", TAILWIND_CSS_VITE, TAILWIND_CSS_VITE_VERSION)
  await addElementToJson(packageJsonPath, "dependencies", TAILWIND_CSS, TAILWIND_CSS_VERSION)
}

async function nuxtConfiguration(projectDir: string) {

}
// src/utils.ts

import { cancel, isCancel, log } from "@clack/prompts";
import { spawnSync } from "child_process";
import { promises as fsPromises } from "fs";
import { mind } from "gradient-string";
import path from "path";
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
  log.step(`Running: ${command} ${name}`);

  const [cmd, ...args] = [...command.split(" "), name];

  const result = spawnSync(cmd, args, {
    stdio: "inherit",
    shell: true,
  });

  if (result.status !== 0) {
    log.error(color.red(`${command} failed or was aborted.`));
    return false;
  }

  return true;
}

/**
 * Searches for a file or directory within a given directory.
 * @param searchDir The directory in which to perform the search
 * @param elementName The name of the file or directory to search for
 * @param isFile If true, search for a file, otherwise search for a directory (default: false)
 * @returns The absolute path of the found element, or `null` if not found
 */
export async function searchElementRecursively(searchDir: string, elementName: string, isFile = false): Promise<string | null> {
  try {
    const files = await fsPromises.readdir(searchDir);

    for (const file of files) {
      const fullPath = path.join(searchDir, file);
      const stats = await fsPromises.stat(fullPath);

      // Check if it is a file or directory based on the isFile parameter
      if (isFile && stats.isFile() && file === elementName) {
        return fullPath; // Found the file
      }

      if (!isFile && stats.isDirectory() && file === elementName) {
        return fullPath; // Found the directory
      }

      // If it is a directory, recursively search within it
      if (stats.isDirectory()) {
        const result = await searchElementRecursively(fullPath, elementName, isFile); // Recursive search
        if (result) {
          return result; // If found in subdirectory, return the path
        }
      }
    }

    return null; // Element not found
  } catch (error) {
    console.error("Error during search:", error);
    return null;
  }
}

/**
 * Adds a line at the start of a file.
 * @param filePath The path of the file.
 * @param line The line to add at the start of the file.
 */
export async function addLineAtStart(filePath: string, line: string) {
  try {
    const content = await fsPromises.readFile(filePath, 'utf-8');
    const newContent = `${line}\n${content}`;
    await fsPromises.writeFile(filePath, newContent);
  } catch (error) {
    console.error(`Error adding line to the start of ${filePath}:`, error);
    process.exit(1);
  }
}

/**
 * Adds an element to an array in a config file.
 * @param filePath The path of the configuration file.
 * @param arrayName The name of the array (e.g., "plugins", "dependencies").
 * @param element The element to add to the array.
 * @param comma A flag to indicate whether to add a comma after the element or not.
 */
export async function addElementToFileArray(filePath: string, arrayName: string, element: string, comma: boolean) {
  try {
    let configContent = await fsPromises.readFile(filePath, 'utf-8');
    
    // Construct the pattern to match the array based on its name
    const arrayPattern = new RegExp(`${arrayName}:\\s*\\[(.*?)\\]`, 's');
    const match = configContent.match(arrayPattern);

    if (match) {
      // If the array exists, add the element if it's not already in the array
      if (!match[1].includes(element) && match.index) {
        const arrayIndex = match.index + match[0].length - 1;  // Position after the closing bracket of the array
        const commaStr = comma ? ',' : '';
        configContent = `${configContent.slice(0, arrayIndex)}\t${element}${commaStr}\n\t${configContent.slice(arrayIndex)}`;
      }
    }

    // Write the modified content back to the file
    await fsPromises.writeFile(filePath, configContent);
  } catch (error) {
    console.error(`Error adding element to the ${arrayName} array in the config file ${filePath}:`, error);
    process.exit(1);
  }
}

/**
 * Adds a key-value pair to an object in a JSON config file.
 * @param filePath The path of the JSON configuration file.
 * @param objectName The name of the object (e.g., "scripts", "dependencies").
 * @param key The key to add to the object.
 * @param value The value to associate with the key.
 */
export async function addElementToJson(filePath: string, objectName: string, key: string, value: string) {
  try {
    let configContent = await fsPromises.readFile(filePath, 'utf-8');
    let configJson = JSON.parse(configContent);

    configJson[objectName][key] = value;
    await fsPromises.writeFile(filePath, JSON.stringify(configJson, null, 2));

  } catch (error) {
    console.error(`Error adding key-value pair to the ${objectName} object in the JSON file ${filePath}:`, error);
    process.exit(1);
  }
}

/**
 * Fetches the latest version of a package from the NPM registry.
 * @param packageName The name of the package.
 * @returns The latest version of the package.
 */
export async function getLatestVersion(packageName: string): Promise<string> {
  try {
    const response = await fetch(`https://registry.npmjs.org/${packageName}/latest`);
    const data = await response.json();
    return data.version;
  } catch (error) {
    console.error(`Error fetching version for package ${packageName}:`, error);
    process.exit(1);
  }
}


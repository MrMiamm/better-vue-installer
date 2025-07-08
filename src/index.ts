#!/usr/bin/env node
// src/index.js

import { program } from "commander";
import { install } from "./commands/install";

program
  .name("bvi")
  .description(
    "Better Vue Installer (bvi) is a CLI that allows you to initialize Vue.js-based frameworks with more options than the default installer.",
  )
  .version("1.0.0");

program
  .command("install")
  .description("Initialize Vue.js based framework project")
  .action(install);

program.parse(process.argv);

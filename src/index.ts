#!/usr/bin/env node
// src/index.js

import { program } from "commander";
import { setup } from "./commands/setup";

program
  .name("bvi")
  .description(
    "Better Vue Installer (BVI) is a CLI that allows you to initialize Vue.js-based frameworks with more options than the default installer.",
  )
  .version("1.0.0");

program
  .command("setup")
  .description("Initialize Vue.js based framework project")
  .action(setup);

program.parse(process.argv);

#!/usr/bin/env node
// src/index.js

import { program } from "commander";
import { setup } from "./commands/setup";
import { configure } from "./commands/configure";

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

program
  .command("configure")
  .description("Configure Vue.js based framework project")
  .action(configure);

program.parse(process.argv);

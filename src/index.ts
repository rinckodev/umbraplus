#!/usr/bin/env node

import chalk from "chalk";
import log from "consola";

log.warn(chalk.yellow("This CLI is deprecated!"));
log.info(chalk.green("Use Constatic CLI instead"));
console.log()
log.log(chalk.dim("> npx constatic@latest"))
console.log()
log.info(chalk.cyanBright(`More info: ${chalk.underline("https://constatic-docs.vercel.app")}`))
console.log()
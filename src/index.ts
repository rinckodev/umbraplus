#!/usr/bin/env node

import { intro } from "@clack/prompts";
import apps from "./apps";
export * from "colors";

async function main(args: string[]){
    intro("welcome to Rincko Cli".cyan);
    apps();
}
main(process.argv.slice(2));
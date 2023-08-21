#!/usr/bin/env node
import { intro } from "@clack/prompts";
import { cyan, green } from "chalk";
import { Command, Option } from "commander";
import { appSelect as apps } from "./apps";
import { readFileSync } from "fs-extra";
import { join } from "path";
import { ProgramProps } from "./@types/ProgramProps";
import languages from "./lang.json";
import { PackageJson } from "./@types/PackageJson";
export { languages }

const packageJson: PackageJson = JSON.parse(readFileSync(join(__dirname, "..", "package.json"), {encoding: "utf-8"}))
const props: ProgramProps = { lang: "en_us" }

const program = new Command(packageJson.name)
.version(packageJson.version)
.arguments('[project-directory]')
.usage(`${green('<project-directory>')} [options]`)
.action((name) => {
    props.appName = name;
})
.addOption(
    new Option("-l, --lang <lang>", "Select program langugage!").choices(["pt_br", "en_us"])
)
.allowUnknownOption()
.parse(process.argv);

const options = program.opts<Partial<ProgramProps>>();

async function main(props: ProgramProps){
    if (options.lang) props.lang = options.lang;
    intro(cyan("✨", languages[props.lang].main.intro, "✨"));
    apps(props);
}
main(props);
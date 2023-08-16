#!/usr/bin/env node
import { intro } from "@clack/prompts";
import { cyan, green } from "chalk";
import packageJson from "./package.json";
import { Command, Option } from "commander";
import { appSelect as apps } from "./apps";

import languages from "./lang.json";

export interface Props {
    appName?: string,
    lang: "pt_br" | "en_us",
    readonly languages: typeof languages;
}
const props: Props = { lang: "en_us", languages }

const langOption = new Option("-l, --lang <lang>", "Select program langugage!").choices(["pt_br", "en_us"])

const program = new Command(packageJson.name)
.version(packageJson.version)
.arguments('[project-directory]')
.usage(`${green('<project-directory>')} [options]`)
.action((name) => {
    props.appName = name;
})
.addOption(langOption)
.allowUnknownOption()
.parse(process.argv);

const options = program.opts<Partial<Props>>();

async function main(props: Props){
    const { languages } = props;
    if (options.lang) props.lang = options.lang;
    intro(cyan("✨", languages[props.lang].main.intro, "✨"));
    apps(props);
}
main(props);
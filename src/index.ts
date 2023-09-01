#!/usr/bin/env node
import { Languages, PackageJson, ProgramProperties } from "./@types/globals";
import { Command, Option } from "commander";
import path from "node:path";
import { readJson } from "./helpers";
import { PromptModule, createPromptModule } from "inquirer";
import langs from "./program.lang.json";
import { bot } from "./apps/bot";
import { brBuilder } from "./helpers/format";
import { style } from "@opentf/cli-styles";
import clack from "@clack/prompts";
import { S_STEP_ACTIVE } from "./constants";

const prompt = createPromptModule()

async function main(){
    const packageJson = readJson<PackageJson>(path.join(__dirname, "../package.json"))
    const properties: ProgramProperties = { lang: "en_us", programRootDir: path.join(__dirname, "..") }
    const programCommand = new Command(packageJson.name)
    .version(packageJson.version)
    .version(packageJson.version)
    // .arguments("[project-directory]")
    // .usage(`<project-directory>" [flags]`)
    // .action((projectDirectory: string) => {
    //     properties.destinationPath = projectDirectory;
    // })
    .addOption(new Option("-l, --lang <language>", "Selecet program language!").choices(["pt_br", "en_us"]))
    .allowUnknownOption()
    .parse(process.argv);

    const options = programCommand.opts<{ lang?: Languages }>()
    if (options.lang) properties.lang = options.lang;
    const { lang } = properties;

    
    clack.intro(style(`${langs.welcome[lang]} 📦 $und.hex(#505050){${packageJson.version}}`))

    const { program } = await prompt<{ program: string }>({
        name: "program",
        message: style(langs.select[lang] + "\n"),
        prefix: style(`$hex(#00B191){${S_STEP_ACTIVE}}`),
        type: "list",
        choices: [
            {
                name: style(langs.options.discodbot[lang]),
                checked: true,
                value: "bot",
            },
            {
                name: style(langs.options.richpresence[lang]),
                value: "richpresence",
                disabled: true,
            },
            { type: "separator" },
            {
                name: style(langs.options.information[lang]),
                value: "info",
            },
            {
                name: style(langs.options.leave[lang]),
                value: "leave",
            }
        ],
    })
    
    const programs = {
        bot,
        info(_properties: ProgramProperties, _prompt: PromptModule){
            clack.note(
                style(brBuilder(...langs.information.notes[lang])),
                langs.information.title[lang]
            )
            clack.outro(style(langs.information.outro[lang]));
            process.exit(0)
        },
        leave(_properties: ProgramProperties, _prompt: PromptModule){
            clack.outro(style(langs.leave[lang]))            
            process.exit(0)
        },
        invalid(_properties: ProgramProperties, _prompt: PromptModule){
        },
    }

    const exec = programs[program as keyof typeof programs]
    if (!exec) {
        programs.invalid(properties, prompt);
        return;
    };
    exec(properties, prompt)
}
main()
.catch(err => {
    console.log(err)
    process.exit(0)
})
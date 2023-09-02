#!/usr/bin/env node
import { Languages, PackageJson, ProgramProperties } from "./@types/globals";
import { Command, Option } from "commander";
import path from "node:path";
import { brBuilder, checkCancel, readJson } from "./helpers";
import langs from "./program.lang.json";
import { bot } from "./apps/bot";
import { style } from "@opentf/cli-styles";
import clack from "@clack/prompts";
import { preferences } from "./other/preferences";
import { info } from "./other/information";
import { getLastestVersion, isOutdated } from "./helpers/package";

async function main(){
    const packageJson = readJson<PackageJson>(path.join(__dirname, "../package.json"))
    const properties: ProgramProperties = { lang: "en_us", programRootDir: path.join(__dirname, "..") }
    const programCommand = new Command(packageJson.name)
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
    
    const lastVersion = await getLastestVersion();
    if (lastVersion && isOutdated(packageJson.version, lastVersion)){
        clack.log.warn(brBuilder(
            langs.outdated[lang][0] + ` @${lastVersion}`,
            langs.outdated[lang][1],
        ));
    }

    const program = checkCancel<string>(await clack.select({
        message: langs.select[lang],
        options: [
            { label: langs.options.discodbot[lang], value: "bot" },
            // { label: langs.options.richpresence[lang], value: "richpresence" },
            // { label: langs.options.preferences[lang], value: "preferences" },
            { label: langs.options.information[lang], value: "info" },
            { label: langs.options.leave[lang], value: "leave" },
        ]
    }))
    
    const programs = {
        bot, preferences, info,
        leave(properties: ProgramProperties){
            clack.outro(style(langs.leave[properties.lang]))            
            process.exit(0)
        },
        invalid(properties: ProgramProperties){

        },
    }

    const exec = programs[program as keyof typeof programs]
    if (!exec) {
        programs.invalid(properties);
        return;
    };
    exec(properties)
}
main()
.catch(err => {
    console.log(err)
    process.exit(0)
})
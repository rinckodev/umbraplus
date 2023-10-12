#!/usr/bin/env node
import { Command, Option } from "commander";
import { checkCancel, getLastestVersion, isOutdated, readJson } from "./helpers";
import { PackageJson } from "./@types/packageJson";
import { join } from "node:path";
import langs from "./lang.json";
import { style } from "@opentf/cli-styles";
import { Signale } from "signale";
import { textReplacer } from "@magicyan/core";
import { botApp } from "./apps/bot";
import { intro, outro, select } from "@clack/prompts";

const log = new Signale({
    config: {
        displayLabel: false,
    }
})

export interface AppOptions {
    language: Languages;
    rootname: string;
}

async function main(){
    const packageJson = readJson<PackageJson>(join(__dirname, "../package.json"))
    
    const program = new Command(packageJson.name)
    .version(packageJson.version)
    .addOption(
        new Option("-l, --lang <language>", "Selecet program language!")
        .choices(["pt_br", "en_us"])
    )
    .allowUnknownOption()
    .parse(process.argv);

    const language: Languages = program.opts().lang || "en_us";

    intro(style(`${langs.welcome[language]} 📦 $und.hex(#505050){${packageJson.version}}`))

    const lastVersion = await getLastestVersion();
    
    if (lastVersion && isOutdated(packageJson.version, lastVersion)){
        log.warn(textReplacer(langs.outdated[language], {
            "var(version)": lastVersion
        }));
    }

    const selectedApp = checkCancel<string>(await select({
        message: langs.select[language],
        options: [
            { label: langs.options.discodbot[language], value: "bot" },
            { label: langs.options.information[language], value: "info" },
            { label: langs.options.leave[language], value: "leave" },
        ]
    }))
    
    const appOptions = { language, rootname: join(__dirname, "..") };

    switch(selectedApp){
        case "bot":{
            botApp(appOptions);
            return;
        }
        case "leave":{
            outro(style(langs.leave[language]))            
            process.exit(0);
        }
    }
}
main();
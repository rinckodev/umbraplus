#!/usr/bin/env node
import { Command, Option } from "commander";
import { checkCancel, getLastestVersion, isOutdated } from "./helpers";
import { readPackageJSON } from "pkg-types";
import { join } from "node:path";
import { style } from "@opentf/cli-styles";
import { textReplacer } from "@magicyan/core";
import botApp from "./apps/bot";
import { intro, outro, select } from "@clack/prompts";
import langs from "./lang.json";
import { consola as log } from "consola"

export interface AppOptions {
    language: Languages;
    rootname: string;
}

async function main(){
    const packageJson = await readPackageJSON(join(__dirname, "../package.json"));
    const packageVersion = packageJson.version!;

    const program = new Command(packageJson.name)
    .version(packageVersion)
    .addOption(
        new Option("-l, --lang <language>", "Selecet program language!")
        .choices(["pt_br", "en_us"])
    )
    .allowUnknownOption()
    .parse(process.argv);

    const language: Languages = program.opts().lang || "en_us";

    intro(style(`${langs.welcome[language]} 📦 $und.hex(#505050){${packageVersion}}`))

    const lastVersion = await getLastestVersion();
    
    if (lastVersion && isOutdated(packageVersion, lastVersion)){
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
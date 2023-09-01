import clack from "@clack/prompts";
import { style } from "@opentf/cli-styles";
import ck from "chalk";
import spawn from "cross-spawn";
import fs from "fs-extra";
import { PromptModule } from "inquirer";
import path from "node:path";
import { cwd } from "node:process";
import { PresetProperties, ProgramProperties } from "../../@types/globals";
import { S_BAR } from "../../constants";
import { brBuilder, editJson, getNpmName, validateNpmName } from "../../helpers";
import langs from "./bot.lang.json";

export async function bot(properties: ProgramProperties, prompt: PromptModule){
    const { lang, programRootDir } = properties;

    const templatesPath = path.join(programRootDir, "templates/discord/bot");

    let { projectName } = await prompt<{ projectName: string }>({
        name: "projectName",
        prefix: style(`${segment()} 📂`),
        message: style(langs.projectName.message[lang]),
        type: "input",
        transformer(input: string) {
            const npmName = getNpmName(input);
            const validation = validateNpmName(npmName);

            if (validation.valid){
                return ck.green(input);
            }
            return ck.red(input);
        },
        validate(input: string) {
            const npmName = getNpmName(input);
            const validation = validateNpmName(npmName);
            if (!input){
                return style(langs.projectName.emptyWarn[lang]);
            }
            if (validation.valid){
                return true
            }
            return ck.red(brBuilder(...(validation.problems || [])));
        },
    })

    properties.destinationPath = path.resolve(projectName);
    const isDestinationCwd = properties.destinationPath == cwd();
    if (isDestinationCwd) projectName = path.basename(cwd());

    const presetChoices: Array<{ name: string, value: string, disabled: boolean }> = []

    for(const presetPath of fs.readdirSync(path.join(templatesPath, "presets"))){
        const presetPropertiesPath = path.join(templatesPath, "presets", presetPath, "properties.json")

        if (fs.existsSync(path.join(presetPropertiesPath))){
            const { disabled, displayName, name }: PresetProperties = (await import(presetPropertiesPath))?.default

            const display = disabled 
            ? style(`$hex(#505050){${displayName[lang]}`) 
            : style(displayName[lang]);

            presetChoices.push({ name: display, value: name, disabled })
        }
    }

    const { preset } = await prompt<{ preset: string }>({
        name: "preset",
        type: "list",
        prefix: style(`${segment()} 🗃️`),
        default: "default",
        message: style(langs.presets[lang]),
        choices: presetChoices
    })

    const { addExamples } = await prompt<{ addExamples: boolean }>({
        name: "addExamples",
        prefix: style(`${segment()} 📄`),
        message: style(langs.examples[lang]),
        type: "confirm",
        default: true,
    })

    const { installDependencies } = await prompt<{ installDependencies: boolean }>({
        name: "installDependencies",
        prefix: style(`${segment()} 📦`),
        message: style(langs.dependencies[lang]),
        type: "confirm",
        default: true,
    })

    const presetPath = path.join(templatesPath, "presets", preset)

    const { destinationPath } = properties;

    const paths = {
        features: {
            guide: path.join(templatesPath, "features", "guide"),
            // server: path.join(templatesPath, "features", "server"),
            snippets: path.join(templatesPath, "features", "snippets")
        },
        template: {
            project: path.join(presetPath, "project"),
            examples: path.join(presetPath, "examples"),
            gitignore: path.join(presetPath, "gitignore"),
        }
    }

    const copyProjectOperation = await fs.copy(paths.template.project, destinationPath, {
        errorOnExist: false, overwrite: true,
        filter: async (srcPath) => {
            const srcBasename = path.basename(srcPath)
            const ignoreItems = ["node_modules", "package-lock.json", ".env.development", "dist"]
            if (ignoreItems.includes(srcBasename)) return false;
            return true;
        }
    })
    .then(() => ({ sucess: true, err: null })).catch(err => ({ sucess: false, err }));
    
    if (!copyProjectOperation.sucess){
        console.log(copyProjectOperation.err);
        return;
    }
    
    await fs.copy(paths.features.snippets, path.join(destinationPath, "/.vscode"))
    await fs.copy(paths.features.guide, destinationPath)
    await fs.copy(paths.template.gitignore, path.join(destinationPath, ".gitignore"))
    await editJson({
        path: path.join(destinationPath, "package.json"),
        propertyName: "name",
        propertyValue: projectName
    })

    if (addExamples){
        await fs.copy(paths.template.examples, destinationPath, { errorOnExist: false, overwrite: true })
    }

    const done = () => {
        const message: string[] = [];

        if (!isDestinationCwd) message.push(`◌ cd ${projectName}`)
        if (!installDependencies) message.push(`◌ npm install`)
        message.push(langs.readme.message[lang])

        clack.note(style(brBuilder(...message)), style(langs.readme.title[lang]))

        clack.outro(style(langs.final[lang]))
    }

    if (installDependencies) {
        const spinner = clack.spinner();
        spinner.start(langs.installing[lang])
        const child = spawn("npm", ["install"], { 
            stdio: "ignore",
            cwd: destinationPath, 
        });

        child.on("exit", () => {
            spinner.stop(langs.installed[lang]);
            done()
        })
        return;
    }
    done();
}

function segment(){
    return `$hex(#666666){${S_BAR}}`
}
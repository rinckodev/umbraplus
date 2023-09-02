import clack from "@clack/prompts";
import { style } from "@opentf/cli-styles";
import spawn from "cross-spawn";
import fs from "fs-extra";
import path from "node:path";
import { cwd } from "node:process";
import { PresetProperties, ProgramProperties } from "../../@types/globals";
import { brBuilder, checkCancel, editJson, getNpmName, validateNpmName } from "../../helpers";
import langs from "./bot.lang.json";

export async function bot(properties: ProgramProperties){
    const { lang, programRootDir } = properties;

    const templatesPath = path.join(programRootDir, "templates/discord/bot");
    
    let projectName = checkCancel(await clack.text({
        message: langs.projectName.message[lang],
        placeholder: langs.projectName.placeholder[lang],
        validate(input) {
            const npmName = getNpmName(input);
            const validation = validateNpmName(npmName);
            if (!input){
                return style(langs.projectName.emptyWarn[lang]);
            }
            if (validation.valid){
                return
            }
            return style(`$r{${brBuilder(...(validation.problems || []))}}`);
        },
    }))

    properties.destinationPath = path.resolve(projectName);
    const isDestinationCwd = properties.destinationPath == cwd();
    if (isDestinationCwd) projectName = path.basename(cwd());

    const presetOptions: Array<{ label: string, value: string, hint?: string }> = []

    for(const presetPath of fs.readdirSync(path.join(templatesPath, "presets"))){
        const presetPropertiesPath = path.join(templatesPath, "presets", presetPath, "properties.json")

        if (fs.existsSync(path.join(presetPropertiesPath))){
            const { disabled, displayName, name }: PresetProperties = (await import(presetPropertiesPath))?.default

            if (!disabled) presetOptions.push({ label: displayName[lang], value: name })
        }
    }

    const preset = checkCancel<string>(await clack.select({
        message: langs.presets[lang],
        options: presetOptions,
        initialValue: presetOptions[0].value,
    }))

    const addExamples = checkCancel(await clack.confirm({
        message: style(langs.examples[lang]),
        active: langs.defaults.confirm.active[lang],
        inactive: langs.defaults.confirm.inactive[lang]
    }))

    const installDependencies = checkCancel(await clack.confirm({
        message: style(langs.dependencies[lang]),
        active: langs.defaults.confirm.active[lang],
        inactive: langs.defaults.confirm.inactive[lang]
    }))

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
            const ignoreItems = [
                "node_modules", 
                "package-lock.json", 
                "dist"
            ];
            const ignoreExtensions = [
                ".env.development",
                ".development.json",
            ]
            if (ignoreExtensions.some(ext => srcBasename.endsWith(ext))) return false;
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

        let loop = 0;
        const emojis = ["😐","🙂","😐","🥱","😴","😑"]
        const timer = setInterval(() => {
            if (loop >= emojis.length) loop = 0;
            spinner.message(`${emojis[loop]} ${langs.installing[lang]}`)
            loop++;
        }, 3000)

        child.on("exit", () => {
            clearInterval(timer);
            spinner.stop("😃 " + langs.installed[lang]);
            done()
        })
        return;
    }
    done();
}
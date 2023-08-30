import ck from "chalk";
import { confirm, log, multiselect, note, outro, select, spinner, text } from "@clack/prompts";
import { copy, existsSync, moveSync } from "fs-extra";
import { basename, join, resolve } from "node:path";
import { languages, programRootDir } from "../../..";
import { ProgramProps } from "../../../@types/ProgramProps";
import { checkCancel, editJson, sleep, validateNpmName } from "../../../functions/utils";
import spawn from "cross-spawn";

const cwd = process.cwd();
const templatePath = join(programRootDir, "templates", "discord", "bot");

async function bot(props: ProgramProps) {
    const { lang, presets, appName } = props;
    const programLang = languages[lang].apps["discord-bot"]
    
    let projectName = "";
    let destinationPath = "";
    let preset = "default";

    if (appName) projectName = appName;
    else {
        const response = await text(programLang.projectName)
        checkCancel(response);
        projectName = String(response);
    }

    destinationPath = resolve(projectName);
    
    const validation = validateNpmName(basename(destinationPath))
    if (!validation.valid && validation.problems) {
        props.appName = undefined;
        log.error(programLang.errors.invalidProjectName + validation.problems[0])
        await sleep(2000);
        bot(props);
        return;
    }

    const isDestinationCwd = destinationPath == cwd;
    if (isDestinationCwd) projectName = basename(cwd);

    // if (presets){
    //     const selected = await select(programLang.presets)
    //     checkCancel(selected);
    //     preset = String(selected)
    // } // soon
    
    const presetPath = join(templatePath, "presets", preset)

    const paths = {
        features: {
            guide: join(templatePath, "features", "guide"),
            server: join(templatePath, "features", "server"),
            snippets: join(templatePath, "features", "snippets")
        },
        template: {
            project: join(presetPath, "project"),
            examples: join(presetPath, "examples"),
            gitignore: join(presetPath, "gitignore"),
        }
    }

    const includeExamples = await confirm(programLang.includeExamples)
    checkCancel(includeExamples);

    const installDependencies = await confirm(programLang.installDep);
    checkCancel(installDependencies);
    
    const copyProjectOperation = await copy(paths.template.project, destinationPath, {
        errorOnExist: false, overwrite: true,
        filter: async (srcPath) => {
            const srcBasename = basename(srcPath)
            const ignoreItems = ["node_modules", "package-lock.json", ".env.development"]
            if (ignoreItems.includes(srcBasename)) return false;
            return true;
        }
    })
    .then(() => ({ sucess: true, err: null })).catch(err => ({ sucess: false, err }));
    
    if (!copyProjectOperation.sucess){
        console.log(copyProjectOperation.err);
        return;
    }
    
    await copy(paths.features.snippets, join(destinationPath, "/.vscode"))
    await copy(paths.features.guide, destinationPath)
    await copy(paths.template.gitignore, join(destinationPath, ".gitignore"))
    await editJson({
        path: join(destinationPath, "package.json"),
        propertyName: "name",
        propertyValue: projectName
    })

    if (includeExamples){
        await copy(paths.template.examples, destinationPath, { errorOnExist: false, overwrite: true })
    }
    
    const notes: string[] = [];
    if (!isDestinationCwd) notes.push(programLang.note.notes.cd.replace("${path}", projectName));
    if (!installDependencies) notes.push(programLang.note.notes.dependencies);
    
    notes.push(
        programLang.note.notes.dev,
        ck.cyanBright.underline(programLang.note.notes.readme)
    );

    const doneProgram = () => {
        note(notes.join("\n"), programLang.note.title);
        outro(ck.blue(programLang.outro))
    }
    
    if (installDependencies){
        const spinnerInstall = spinner();
        spinnerInstall.start(programLang.installDepSpinner.start)

        const child = spawn("npm", ["install"], { stdio: "inherit", cwd: destinationPath });

        child.on("close", () => {
            spinnerInstall.stop(programLang.installDepSpinner.stop);
            doneProgram();
        })
        return;
    }

    doneProgram();    
}

export { bot };

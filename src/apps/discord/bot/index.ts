import { log, text, confirm, note, spinner,  } from "@clack/prompts";
import { join, resolve, basename } from "path";
import { checkCancel, validateNpmName } from "../../../functions/utils";
import { copy, readFileSync, writeFileSync } from "fs-extra";
import { spawn } from "cross-spawn";
import { ProgramProps } from "../../../@types/ProgramProps";
import { languages } from "../../..";

const cwd = process.cwd();
const templatePath = join(__dirname, "../../../..", "templates", "discordbot");

async function bot(props: ProgramProps){
    const { lang } = props;
    const currentAppLang = languages[lang].apps["discord-bot"]

    let projectName: string = "";
    let destinationPath: string = "";
    let appPath: string = "";

    if (!props.appName){
        const projectName = await text(currentAppLang.projectName)
        checkCancel(projectName);
        props.appName = String(projectName);
        appPath = props.appName;
    }

    const validation = validateNpmName(basename(resolve(props.appName)))
    if (!validation.valid && validation.problems) {
        props.appName = undefined;
        log.error(currentAppLang.errors.invalidProjectName + validation.problems[0])
        bot(props);
        return;
    }

    projectName = props.appName;
    destinationPath = resolve(projectName);
    const isDestinationCwd = destinationPath == cwd;

    if (isDestinationCwd){
        projectName = basename(cwd);
    }

    const includeExamples = await confirm(currentAppLang.includeExamples)
    checkCancel(includeExamples);

    const installDep = await confirm(currentAppLang.installDep);
    checkCancel(installDep);
    
    const templateProjectPath = join(templatePath, "v14", "pressets", "default")
    const templateExamplesPath = join(templatePath, "v14", "examples")
    const templateGitignorePath = join(templatePath, "v14", "gitignore")
    const destinationExamplesPath = join(destinationPath, "src", "discord")
    
    await copy(templateProjectPath, destinationPath, { 
        errorOnExist: false, overwrite: true,
        async filter(src){ // development mode
            const ignoreItems = [
                "node_modules",
                "package-lock.json",
                ".env.development"
            ]
            if (ignoreItems.some((ignoreSrc) => src.includes(ignoreSrc))) {
                return false; 
            }
            return true;
        } 
    });
    await copy(templateGitignorePath, join(destinationPath, ".gitignore"), { errorOnExist: false, overwrite: true })

    const packageJson = JSON.parse(readFileSync(join(destinationPath, "package.json"), {encoding: "utf-8"}))
    packageJson.name = projectName;

    writeFileSync(join(destinationPath, "package.json"), JSON.stringify(packageJson, null, 2));

    if (includeExamples){
        await copy(templateExamplesPath, destinationExamplesPath, { errorOnExist: false, overwrite: true })
    }
    
    const installDepSpinner = spinner();

    const notes: string[] = [];

    if (!isDestinationCwd) notes.push(currentAppLang.note.notes.cd.replace("${path}", appPath))
    if (!installDep) notes.push(currentAppLang.note.notes.dependencies)
    notes.push(currentAppLang.note.notes.dev, currentAppLang.note.notes.readme)

    if (installDep){
        installDepSpinner.start(currentAppLang.installDepSpinner.start)
        const child = spawn("npm", ["install"], { stdio: "inherit", cwd: destinationPath });

        child.on("close", () => {
            installDepSpinner.stop(currentAppLang.installDepSpinner.stop);
            note(notes.join("\n"), currentAppLang.note.title);
        })
        return;
    }
    
    note(notes.join("\n"), currentAppLang.note.title);
}

export { bot };
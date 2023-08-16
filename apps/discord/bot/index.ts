import { log, text, confirm, note, outro, spinner,  } from "@clack/prompts";
import { join, resolve, basename } from "path";
import { Props } from "../../../main";
import { checkCancel, validateNpmName } from "../../../functions/utils";
import { copy, readFileSync, writeFileSync } from "fs-extra";
import { spawn, sync } from "cross-spawn";

const cwd = process.cwd();
const templatePath = join(__dirname, "../../../..", "templates", "discordbot");

async function bot(props: Props){
    const { lang, languages } = props;
    const currentAppLang = languages[lang].apps["discord-bot"]

    let projectName: string = "";
    let destinationPath: string = "";

    if (!props.appName){
        const projectName = await text(currentAppLang.projectName)
        checkCancel(projectName);
        props.appName = String(projectName);
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

    if (destinationPath == cwd){
        projectName = basename(cwd);
    }

    const includeExamples = await confirm(currentAppLang.includeExamples)
    checkCancel(includeExamples);

    const installDep = await confirm(currentAppLang.installDep);
    checkCancel(installDep);
    
    const templateProjectPath = join(templatePath, "v14", "project")
    const templateExamplesPath = join(templatePath, "v14", "examples")
    const templateGitignorePath = join(templatePath, "v14", "gitignore")
    const destinationExamplesPath = join(destinationPath, "src", "discord")
    
    await copy(templateProjectPath, destinationPath, { errorOnExist: false, overwrite: true });
    await copy(templateGitignorePath, join(destinationPath, ".gitignore"), { errorOnExist: false, overwrite: true })

    const packageJson = JSON.parse(readFileSync(join(destinationPath, "package.json"), {encoding: "utf-8"}))
    packageJson.name = projectName;

    writeFileSync(join(destinationPath, "package.json"), JSON.stringify(packageJson, null, 2));

    if (includeExamples){
        await copy(templateExamplesPath, destinationExamplesPath, { errorOnExist: false, overwrite: true })
    }
    
    const installDepSpinner = spinner();

    if (installDep){
        installDepSpinner.start(currentAppLang.installDepSpinner.start)
        const child = spawn("npm", ["install"], { stdio: "inherit", cwd: destinationPath });

        child.on("close", () => {
            installDepSpinner.stop(currentAppLang.installDepSpinner.stop);
            note(currentAppLang.note.message, currentAppLang.note.title);
        })
        return;
    }
    
    note(currentAppLang.note.message, currentAppLang.note.title);
}

export { bot };
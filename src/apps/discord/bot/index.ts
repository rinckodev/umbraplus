import ck from "chalk";
import { confirm, log, note, outro, select, spinner, text } from "@clack/prompts";
import { copy } from "fs-extra";
import { basename, join, resolve } from "path";
import { languages, programRootDir } from "../../..";
import { ProgramProps } from "../../../@types/ProgramProps";
import { checkCancel, editJson, sleep, validateNpmName } from "../../../functions/utils";
import spawn from "cross-spawn";

const cwd = process.cwd();
const templatePath = join(programRootDir, "templates", "discord", "bot", "v14");

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

    if (presets){
        const selected = await select(programLang.presets)
        checkCancel(selected);
        preset = String(selected)
    }

    const includeExamples = await confirm(programLang.includeExamples)
    checkCancel(includeExamples);

    const installDependencies = await confirm(programLang.installDep);
    checkCancel(installDependencies);

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
        },
        destination:{
            examples: join(destinationPath, "src", "discord")
        }
    }
    
    await copy(paths.template.project, destinationPath, {
        errorOnExist: false, overwrite: true, async filter(src){
            const ignoreItems = ["node_modules", "package-lock.json", ".env.development"]
            if (ignoreItems.some(ignoreSrc => src.includes(ignoreSrc))){
                return false
            }
            return true;
        }
    })

    await copy(paths.features.snippets, join(destinationPath, "/.vscode"))
    await copy(paths.features.guide, destinationPath)
    await copy(paths.template.gitignore, join(destinationPath, ".gitignore"))

    editJson({
        path: join(destinationPath, "package.json"),
        propertyName: "name",
        propertyValue: projectName
    })

    if (includeExamples){
        await copy(paths.template.examples, paths.destination.examples, { errorOnExist: false, overwrite: true })
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

// async function bot(props: ProgramProps){
//     const { lang, presets } = props;
//     const currentAppLang = languages[lang].apps["discord-bot"]

//     let projectName: string = "";
//     let destinationPath: string = "";
//     let appPath: string = "";
//     let preset = "default";

//     if (!props.appName){
//         const projectName = await text(currentAppLang.projectName)
//         checkCancel(projectName);
//         props.appName = String(projectName);
//         appPath = props.appName;
//     }

//     const validation = validateNpmName(basename(resolve(props.appName)))
//     if (!validation.valid && validation.problems) {
//         props.appName = undefined;
//         log.error(currentAppLang.errors.invalidProjectName + validation.problems[0])
//         bot(props);
//         return;
//     }

//     projectName = props.appName;
//     destinationPath = resolve(projectName);
//     const isDestinationCwd = destinationPath == cwd;

//     if (isDestinationCwd){
//         projectName = basename(cwd);
//     }

//     if (presets){
//         const selected = await select({
//             message: "Select the bot preset",
//             options: [
//                 { label: "default", value: "default" },
//                 { label: "firestore", value: "firestore" },
//                 { label: "mongodb", value: "mongodb" },
//                 { label: "mysql", value: "mysql" },
//                 { label: "quickdb", value: "quickdb" }
//             ],
//         })
//         checkCancel(selected);
//     }
    
//     const includeExamples = await confirm(currentAppLang.includeExamples)
//     checkCancel(includeExamples);

//     const installDep = await confirm(currentAppLang.installDep);
//     checkCancel(installDep);
    
//     const templateProjectPath = join(templatePath, "v14", "presets", preset)
//     const templateExamplesPath = join(templatePath, "v14", "examples")
//     const templateGitignorePath = join(templatePath, "v14", "gitignore")
//     const destinationExamplesPath = join(destinationPath, "src", "discord")
    
//     await copy(templateProjectPath, destinationPath, { 
//         errorOnExist: false, overwrite: true,
//         async filter(src){ // development mode
//             const ignoreItems = [
//                 "node_modules",
//                 "package-lock.json",
//                 ".env.development"
//             ]
//             if (ignoreItems.some((ignoreSrc) => src.includes(ignoreSrc))) {
//                 return false; 
//             }
//             return true;
//         } 
//     });
//     await copy(templateGitignorePath, join(destinationPath, ".gitignore"), { errorOnExist: false, overwrite: true })

//     const packageJson = JSON.parse(readFileSync(join(destinationPath, "package.json"), {encoding: "utf-8"}))
//     packageJson.name = projectName;

//     writeFileSync(join(destinationPath, "package.json"), JSON.stringify(packageJson, null, 2));

//     if (includeExamples){
//         await copy(templateExamplesPath, destinationExamplesPath, { errorOnExist: false, overwrite: true })
//     }
    
//     const installDepSpinner = spinner();

//     const notes: string[] = [];

//     if (!isDestinationCwd) notes.push(currentAppLang.note.notes.cd.replace("${path}", appPath))
//     if (!installDep) notes.push(currentAppLang.note.notes.dependencies)
//     notes.push(currentAppLang.note.notes.dev, currentAppLang.note.notes.readme)

//     if (installDep){
//         installDepSpinner.start(currentAppLang.installDepSpinner.start)
//         const child = spawn("npm", ["install"], { stdio: "inherit", cwd: destinationPath });

//         child.on("close", () => {
//             installDepSpinner.stop(currentAppLang.installDepSpinner.stop);
//             note(notes.join("\n"), currentAppLang.note.title);
//         })
//         return;
//     }
    
//     note(notes.join("\n"), currentAppLang.note.title);
// }

export { bot };

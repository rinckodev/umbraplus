import { AppOptions } from "..";
import langs from "./bot.lang.json";
import { checkCancel, editJson, getNpmName, validateNpmName } from "../helpers";
import { style } from "@opentf/cli-styles";
import { brBuilder } from "@magicyan/core";
import fs from "fs-extra";
import { join, basename, resolve }  from "node:path";
import { confirm, group, log, note, outro, select, spinner, text } from "@clack/prompts";
import spawn from "cross-spawn";

interface Options {
    projectName: string;
    database: string;
    prisma?: boolean;
    examples: boolean;
    dependencies: boolean
}

interface DatabaseOption {
    label: string;
    value: string;
    prisma?: boolean;
}

export async function botApp({ language, rootname }: AppOptions){

    const templatePath = join(rootname, "templates/discord/bot");

    const databaseOptions: DatabaseOption[] = [
        { label: langs.databaseNone[language], value: "none" }
    ]

    for(const databasePath of fs.readdirSync(join(templatePath, "databases"))){
        const databasePropertiesPath = join(templatePath, "databases", databasePath, "properties.json")

        if (fs.existsSync(join(databasePropertiesPath))){
            const properties: DatabaseProperties = (await import(databasePropertiesPath))?.default
            const { enabled, displayName, name, prisma } = properties;
            if (enabled) databaseOptions.push({ 
                label: displayName[language], value: name, prisma 
            })
        }
    }

    const options = await group<Options>({
        projectName: async () => {

            return checkCancel<string>(
                await text({ 
                    message: langs.projectName.message[language],
                    placeholder: langs.projectName.placeholder[language],
                    validate(input) {
                        const npmName = getNpmName(input);
                        const validation = validateNpmName(npmName);
                        if (!input){
                            return style(langs.projectName.emptyWarn[language]);
                        }
                        if (!validation.valid){
                            const problems = validation.problems || [];
                            return style(`$r{${brBuilder(...problems)}}`);
                        }
                    },
                })
            )
        },
        database: async () => {
            return checkCancel<string>(
                await select({
                    message: langs.database[language],
                    options: databaseOptions
                })
            )
        },
        prisma: async ({ results  }) => {
            const database = databaseOptions.find(d => d.value == results.database);
            if (!database?.prisma) return;
            
            return checkCancel<boolean>(
                await confirm({ message: style(langs.prisma[language]) })
            )
        },
        examples: async () => {
            return checkCancel<boolean>(
                await confirm({ message: langs.examples[language]})
            )
        },
        dependencies: async () => {
            return checkCancel<boolean>(
                await confirm({ message: langs.dependencies[language]})
            )
        }
    })

    const { database, prisma, examples, dependencies } = options;
    let { projectName } = options;

    let destinationPath = resolve(projectName);
    const isDestinationCwd = destinationPath == process.cwd();
    if (isDestinationCwd) projectName = basename(process.cwd());

    const paths = {
        template: {
            project: join(templatePath, "project"),
            examples: join(templatePath, "examples", database == "none" ? "default" : database),
            gitignore: join(templatePath, "gitignore.txt"),
        }
    }

    const copyProjectOperation = await fs.copy(paths.template.project, destinationPath, {
        errorOnExist: false, overwrite: true,
        filter: copyFilesFilter
    })
    .then(() => ({ sucess: true, err: null }))
    .catch(err => ({ sucess: false, err }));

    if (!copyProjectOperation.sucess){
        log.error(copyProjectOperation.err);
        outro();
        return;
    }

    if (database !== "none"){
        const databasePath = prisma 
        ? join(templatePath, "databases", database, "prisma")
        : join(templatePath, "databases", database, "default")

        const copyDatabaseOperation = await fs.copy(databasePath, destinationPath, {
            errorOnExist: false, overwrite: true,
            filter: copyFilesFilter
        })
        .then(() => ({ sucess: true, err: null }))
        .catch(err => ({ sucess: false, err }));

        if (!copyDatabaseOperation.sucess){
            log.error(copyProjectOperation.err);
            outro();
            return;
        }
    }
    
    await fs.copy(paths.template.gitignore, join(destinationPath, ".gitignore"))
    await editJson({
        path: join(destinationPath, "package.json"),
        propertyName: "name",
        propertyValue: projectName
    })

    if (examples){
        await fs.copy(paths.template.examples, destinationPath, { errorOnExist: false, overwrite: true })
    }

    const done = () => {
        const message: string[] = [];

        if (!isDestinationCwd) message.push(`◌ cd ${projectName}`)
        if (!dependencies) message.push("◌ npm install")
        message.push(langs.readme.message[language])

        note(style(brBuilder(...message)), style(langs.readme.title[language]))

        outro(style(langs.final[language]))
    }

    if (dependencies) {
        const spin = spinner();
        spin.start(langs.installing[language])
        const child = spawn("npm", ["install"], { 
            stdio: "ignore",
            cwd: destinationPath,
        });

        let loop = 0;
        const emojis = ["😐","🙂","😐","🥱","😴","😑"]
        const timer = setInterval(() => {
            if (loop >= emojis.length) loop = 0;
            spin.message(`${emojis[loop]} ${langs.installing[language]}`)
            loop++;
        }, 3000)

        child.on("exit", () => {
            clearInterval(timer);
            spin.stop("😃 " + langs.installed[language]);
            done()
        })
        return;
    }
    done();
    
}

async function copyFilesFilter(srcPath: string){
    const srcBasename = basename(srcPath)
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
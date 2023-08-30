import { readdir, stat, readFile, writeFile } from "node:fs/promises";
import { join, extname } from "node:path";
import JSZip from "jszip";
import ck from "chalk";
import packagejson from "../package.json";
import { cwd } from "node:process";

const zip = new JSZip();
const ignoreList = [
    "node_modules", "src", "scripts", ".vscode", "README.md", "docs", 
    ".env.example", ".env.development", "nodemon.json",
    ".gitignore", ".eslintignore", "tsconfig.json",
    ".eslintrc.json", "package-lock.json",
];

const ignoreExtensions = [
    ".zip", ".exe"
];

async function exec() {
    const addFilesRecursively = async (folderPath: string, parentZipFolder: JSZip) => {
        const items = await readdir(folderPath);
    
        for (const item of items) {
            if (ignoreList.includes(item) || ignoreExtensions.includes(extname(item))) continue;
            const itemPath = join(folderPath, item);
            const stats = await stat(itemPath);

            if (stats.isDirectory()) {
                const subZipFolder = parentZipFolder.folder(item);
                if (subZipFolder) await addFilesRecursively(itemPath, subZipFolder);
            } else {
                const fileContent = await readFile(itemPath);
                parentZipFolder.file(item, fileContent);
            }
        }
    };
    
    await addFilesRecursively(cwd(), zip);
    const zipContent = await zip.generateAsync({ type: "nodebuffer" });
    await writeFile(`${packagejson.name}.zip`, zipContent);
}

exec()
.then(() => console.log(ck.green("Zip file successfully created!")))
.catch(err => console.log(ck.green("An error occurred while trying to create the zip file!", ck.red(err))));
import fs from "fs-extra";

export function readJson<T>(path: string): T{
    const file = fs.readFileSync(path, { encoding: "utf-8"})
    return JSON.parse(file);
}

interface EditJsonProps {
    path: string,
    propertyName: string,
    propertyValue: string | number | boolean | Object
}
export async function editJson({ path, propertyName, propertyValue }: EditJsonProps){
    const packageJson = JSON.parse(await fs.readFile(path, {encoding: "utf-8"}))
    packageJson[propertyName] = propertyValue;
    await fs.writeFile(path, JSON.stringify(packageJson, null, 2));
}
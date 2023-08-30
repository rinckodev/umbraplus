export { setTimeout as sleep } from "node:timers/promises";
import { cancel, isCancel } from "@clack/prompts";
import { readFile, writeFile } from "fs-extra";
import validateProjectName from "validate-npm-package-name";

export function checkCancel(value: any){
    if (isCancel(value)) {
        cancelOperation();
    }
}
export function cancelOperation(message="Operation cancelled."){
    cancel(message);
    process.exit(0);
}

export function validateNpmName(name: string): { valid: boolean, problems?: string[] }{
  const { validForNewPackages, errors, warnings } = validateProjectName(name)
  if (validForNewPackages) {
    return { valid: true }
  }
  return {
    valid: false,
    problems: [
      ...(errors || []),
      ...(warnings || []),
    ],
  }
}
interface EditJsonProps {
  path: string,
  propertyName: string,
  propertyValue: string | number | boolean | Object
}
export async function editJson({ path, propertyName, propertyValue }: EditJsonProps){
  const packageJson = JSON.parse(await readFile(path, {encoding: "utf-8"}))
  packageJson[propertyName] = propertyValue;
  await writeFile(path, JSON.stringify(packageJson, null, 2));
}

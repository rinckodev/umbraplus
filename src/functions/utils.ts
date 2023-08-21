export { setTimeout as sleep } from "node:timers/promises";
import { isCancel, cancel } from "@clack/prompts";

export function checkCancel(value: any){
    if (isCancel(value)) {
        cancelOperation();
    }
}
export function cancelOperation(message="Operation cancelled."){
    cancel(message);
    process.exit(0);
}

import validateProjectName from "validate-npm-package-name"
import { PackageJson } from "../@types/PackageJson";
import { readFile, readFileSync, writeFile, writeFileSync } from "fs-extra";

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

// export function getPackageJson(path: string){
//   const packageJson: PackageJson = JSON.parse(readFileSync(path, {encoding: "utf-8"}))

//   writeFileSync(join(destinationPath, "package.json"), JSON.stringify(packageJson, null, 2));
// }
interface EditPackageJsonProps {
  path: string,
  propertyName: string,
  propertyValue: any
}
export async function editJson({ path, propertyName, propertyValue }: EditPackageJsonProps){
  const packageJson = JSON.parse(await readFile(path, {encoding: "utf-8"}))
  packageJson[propertyName] = propertyValue;
  await writeFile(path, JSON.stringify(packageJson, null, 2));
}
import validateNpmPackageName from "validate-npm-package-name";
import path from "node:path";

export function validateNpmName(name: string): { valid: boolean, problems?: string[] }{
    const { validForNewPackages, errors, warnings } = validateNpmPackageName(name)
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

export function getNpmName(pathName: string){
  return path.basename(path.resolve(pathName))
}
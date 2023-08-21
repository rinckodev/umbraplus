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
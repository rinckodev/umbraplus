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
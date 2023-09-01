import { isUnicodeSupported } from "./checks";

export function brBuilder(...text: string[]){
    return text.join("\n")
}

export const s = (c: string, fallback: string) => (isUnicodeSupported() ? c : fallback);
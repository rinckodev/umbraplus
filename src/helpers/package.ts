import clack from "@clack/prompts";
import path from "node:path";
import { readJson } from "./files";
import { Languages, PackageJson } from "../@types/globals";

const packageJson = readJson<PackageJson>(path.join(__dirname, "../../package.json"))

export async function getLastestVersion(): Promise<string | null>{
    async function request(){
        const data = await fetch(`https://registry.npmjs.org/${packageJson.name}`);
        return data.json();
    }
    return await request()
    .then(data => data["dist-tags"]?.latest)
    .catch(() => null)
}

export function isOutdated(current: string, latest: string){
    return current < latest;
}
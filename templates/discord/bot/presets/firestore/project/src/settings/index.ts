import dotenv from "dotenv";
import { existsSync, readFileSync } from "node:fs";
import { resolve, basename } from "node:path";
import { Signale } from "signale";
import settings from "./settings.json";
import "./constants";
import ck from "chalk";
import { ServiceAccount } from "firebase-admin";

const developmentEnvPath = resolve(__rootname, ".env.development");

const dev = existsSync(developmentEnvPath);

const { parsed: parsedEnv } = dotenv.config({
    path: existsSync(developmentEnvPath) 
    ? developmentEnvPath 
    : resolve(__rootname, ".env")
});

const processEnv = { ...(parsedEnv as NodeJS.ProcessEnv), dev };

const log = new Signale({ types: {
    successComamnd: { badge: "√", color: "blue", label: "Command" },
    successEvent: { badge: "√", color: "yellow", label: "Event" },
    successComponent: { badge: "√", color: "cyan", label: "Component" }
}});

const firebaseAccountPath = dev 
? resolve(__rootname, "firebase.development.json")
: resolve(__rootname, "firebase.json");

if (!existsSync(firebaseAccountPath)){
    const filename = ck.yellow(`"${basename(firebaseAccountPath)}"`);
    const directory = ck.cyan(resolve(firebaseAccountPath, ".."));
    const text = ck.red(`The ${filename} file was not found in ${directory}`);
    console.error(text);
    process.exit(0);
}

const firebaseAccount: ServiceAccount = JSON.parse(
    readFileSync(firebaseAccountPath, {encoding: "utf-8"})
);

export { log, processEnv, settings, firebaseAccount };

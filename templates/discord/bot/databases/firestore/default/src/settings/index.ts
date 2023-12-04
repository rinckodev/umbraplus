import dotenv from "dotenv";
import { existsSync, readFileSync } from "node:fs";
import { consola as log } from "consola";
import settings from "./settings.json";
import "./constants";

const developmentEnvPath = rootTo(".env.development");

dotenv.config({
    path: existsSync(developmentEnvPath)
    ? developmentEnvPath
    : rootTo(".env")
});

import { ServiceAccount } from "firebase-admin";
import { basename } from "node:path";
import ck from "chalk";

const firebaseAccountPath = existsSync(developmentEnvPath)
? rootTo("firebase.development.json") 
: rootTo("firebase.json");

if (!existsSync(firebaseAccountPath)){
    const filename = ck.yellow(`"${basename(firebaseAccountPath)}"`);
    const text = ck.red(`The ${filename} file was not found in ${__rootname}`);
    log.error(text);
    process.exit(0);
}

const firebaseAccount: ServiceAccount = JSON.parse(
    readFileSync(firebaseAccountPath, {encoding: "utf-8"})
);

export { log, settings, firebaseAccount };
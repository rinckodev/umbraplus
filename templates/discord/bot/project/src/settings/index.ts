import dotenv from "dotenv";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { Signale } from "signale";
import settings from "./settings.json";
import "./constants";

const developmentEnvPath = resolve(__rootname, ".env.development");

const dev = existsSync(developmentEnvPath);

const { parsed: parsedEnv } = dotenv.config({
    path: existsSync(developmentEnvPath) 
    ? developmentEnvPath 
    : resolve(__rootname, ".env")
});

const processEnv = { ...(parsedEnv as NodeJS.ProcessEnv), dev };

const log = new Signale();

export { log, processEnv, settings };

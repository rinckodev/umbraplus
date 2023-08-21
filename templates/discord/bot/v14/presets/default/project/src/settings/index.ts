import settings from "./settings.json";
import dotenv from "dotenv";
import { existsSync } from "fs";
import { resolve } from "path";

const rootDir = process.cwd();
const developmentEnvPath = resolve(rootDir, ".env.development");

const { parsed: parsedEnv } = dotenv.config({
    path: existsSync(developmentEnvPath) ? developmentEnvPath : resolve(rootDir, ".env")
});

const processEnv = parsedEnv as NodeJS.ProcessEnv;

export { settings, processEnv };
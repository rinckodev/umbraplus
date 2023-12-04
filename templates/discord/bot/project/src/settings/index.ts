import dotenv from "dotenv";
import { existsSync } from "node:fs";
import { consola as log } from "consola";
import settings from "./settings.json";
import "./constants";

const developmentEnvPath = rootTo(".env.development");

dotenv.config({
    path: existsSync(developmentEnvPath)
    ? developmentEnvPath
    : rootTo(".env")
});

export { log, settings };
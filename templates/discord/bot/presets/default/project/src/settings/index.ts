import dotenv from "dotenv";
import { existsSync } from "fs";
import { resolve } from "path";
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

const log = new Signale({ types: {
    successComamnd: { badge: "√", color: "blue", label: "Command" },
    successEvent: { badge: "√", color: "yellow", label: "Event" },
    successComponent: { badge: "√", color: "cyan", label: "Component" }
}});

export { log, processEnv, settings };

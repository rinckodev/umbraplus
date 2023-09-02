import { ExtendedClient } from "@discord/base";
import { onCrash } from "./functions";
import "./database";

const client = new ExtendedClient();
client.start();

process.on("uncaughtException", onCrash);
process.on("unhandledRejection", onCrash);
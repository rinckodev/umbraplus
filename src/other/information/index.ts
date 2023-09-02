import clack from "@clack/prompts";
import { ProgramProperties } from "../../@types/globals";
import { brBuilder } from "../../helpers";
import { style } from "@opentf/cli-styles";
import langs from "./info.lang.json";

export async function info(properties: ProgramProperties) {
    clack.note(
        style(brBuilder(...langs.notes[properties.lang])),
        langs.title[properties.lang]
    )
    clack.outro(style(langs.outro[properties.lang]));
    process.exit(0)
}
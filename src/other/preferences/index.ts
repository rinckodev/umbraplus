import clack from "@clack/prompts";
// import { ProgramProperties } from "../../@types/globals";
import { checkCancel } from "../../helpers";

export async function preferences(properties: ProgramProperties) {
    const preference = checkCancel<string>(await clack.selectKey({
        message: "Select preference",
        options: [
            { label: "Language", value: "lang", },
        ]
    }))
}
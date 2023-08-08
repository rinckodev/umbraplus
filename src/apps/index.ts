import { intro, outro, select, log } from "@clack/prompts";
import richpresence from "./discord/richpresence";
import { cancelOperation, checkCancel, sleep } from "../functions/utils";
async function appSelect(){
    const selected = await select({
        message: "Select the app you want to create",
        options: [
            { label: "Discord Custom Rich Presence", value: "discord-richpresence" },
            { label: "Discord Bot", value: "discord-bot", hint: "Soon" },
            { label: "Express Api", value: "express-api", hint: "Soon" },
            { label: "Leave".red, value: "leave" },
        ]
    })

    checkCancel(selected);

    switch(selected){
        case "discord-richpresence":richpresence()
            return;
        case "leave":{
            cancelOperation("End");
            return;
        }
        default: {
            log.error("The selected item is currently unavailable".red)
            await sleep(1000);
            appSelect();
        }
    }
}
export default appSelect
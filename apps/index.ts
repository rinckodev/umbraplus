import { log, select } from "@clack/prompts";
import { cancelOperation, checkCancel, sleep } from "../functions/utils";
import { bot } from "./discord/bot";
import { Props } from "../main";

async function appSelect(props: Props){
    const { lang, languages } = props;
    const selected = await select({
        message: languages[lang].apps.title,
        options: languages[lang].apps.options.map(option => option)
    })

    checkCancel(selected);

    switch(selected){
        case "discord-bot": bot(props)
            return;
        case "leave":{
            cancelOperation("End");
            return;
        }
        default: {
            log.error(languages[lang].apps.errors.unavailable)
            await sleep(1000);
            appSelect(props);
        }
    }
}
export { appSelect }
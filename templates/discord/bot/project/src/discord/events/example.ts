import { log } from "@/settings";
import { Event } from "@discord/base";
import { sleep } from "@magicyan/discord";
import ck from "chalk";

new Event({
    name: "ready", once: true, 
    async run() {
        await sleep(2000);
        log.success(ck.green("Everything is working correctly!"));
    },
});
import { sleep } from "@/functions";
import { Event } from "@discord/base";
import ck from "chalk";

export default new Event({
    name: "ready",
    once: true,
    async run(client) {
        await sleep(2000);
        console.log(ck.greenBright.underline("\n✓ Everything is working correctly!"));
    },
});
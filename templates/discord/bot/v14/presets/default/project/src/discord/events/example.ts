import { Event } from "@discord/base";
import ck from "chalk";

export default new Event({
    name: "ready",
    run(client) {
        console.log(`${ck.cyan("Buttons: ", client.Buttons.size)}`);
    },
});
import { Event } from "@discord/base";

new Event({
    name: "messageDelete",
    run(message) {
        console.log(`[deleted message] ${message.author?.username}: ${message.content}`);
    },
});
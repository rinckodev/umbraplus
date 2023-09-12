import { Event } from "@discord/base";

new Event({
    name: "guildMemberRemove",
    run(member) {
        console.log(`Bye ${member.user.username}`);
    },
});
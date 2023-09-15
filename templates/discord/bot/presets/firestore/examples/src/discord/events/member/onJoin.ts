import { Event } from "@discord/base";

new Event({
    name: "guildMemberAdd",
    run(member) {
        console.log(`New member ${member.user.username}`);
    },
});
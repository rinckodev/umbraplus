import { Event } from "@discord/base";

export default new Event({
    name: "guildMemberRemove",
    run(member) {
        console.log(`Bye ${member.user.username}`);
    },
});
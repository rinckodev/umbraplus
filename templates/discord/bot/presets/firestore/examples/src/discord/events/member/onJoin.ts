import { Event } from "@discord/base";

export default new Event({
    name: "guildMemberAdd",
    run(client, member) {
        console.log(`New member ${member.user.username}`);
    },
});
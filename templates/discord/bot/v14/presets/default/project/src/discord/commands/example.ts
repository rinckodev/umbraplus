import { Command } from "@discord/base";
import { ApplicationCommandType } from "discord.js";

export default new Command({
    name: "example",
    description: "Example command",
    dmPermission: false,
    type: ApplicationCommandType.ChatInput,
    async run({interaction}){
        interaction.reply({ephemeral: true, content: "This is a example command!"});
    }
});
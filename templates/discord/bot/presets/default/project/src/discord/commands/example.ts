import { hexToRgb } from "@/functions";
import { settings } from "@/settings";
import { Command } from "@discord/base";
import { ApplicationCommandType, EmbedBuilder } from "discord.js";
import { createEmbedAuthor } from "../functions/utils/embeds";

export default new Command({
    name: "example",
    description: "Example command",
    dmPermission: false,
    type: ApplicationCommandType.ChatInput,
    async run({ interaction, client }){
        const embed = new EmbedBuilder({
            author: createEmbedAuthor({ user: client.user }),
            color: hexToRgb(settings.colors.theme.success),
            description: "This is a example command!"
        });
        
        interaction.reply({ ephemeral: true, embeds: [embed] });
    },
});
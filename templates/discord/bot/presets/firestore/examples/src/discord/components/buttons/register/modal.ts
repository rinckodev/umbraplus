import { Component } from "@/discord/base";
import { hexToRgb } from "@/functions";
import { settings } from "@/settings";
import { EmbedBuilder } from "discord.js";

export default new Component({
    customId: "register-start-modal",
    cache: "cached",
    type: "Modal",
    async run(interaction) {
        const { fields, member } = interaction;
        const name = fields.getTextInputValue("register-name-input");
        const nickname = fields.getTextInputValue("register-nickname-input");
        
        interaction.reply({
            ephemeral: true,
            embeds: [new EmbedBuilder({
                author: { name: member.user.username, iconURL: member.displayAvatarURL() },
                color: hexToRgb(settings.colors.theme.primary),
                description: `Welcome ${name}, your nick in server is ${nickname}`
            })]
        });
    },
});
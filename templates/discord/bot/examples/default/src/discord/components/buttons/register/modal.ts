import { Component } from "@/discord/base";
import { settings } from "@/settings";
import { createEmbedAuthor, hexToRgb } from "@magicyan/discord";
import { EmbedBuilder } from "discord.js";

new Component({
    customId: "register-start-modal",
    cache: "cached",
    type: "Modal",
    async run(interaction) {
        const { fields, member, user } = interaction;
        const name = fields.getTextInputValue("register-name-input");
        const nickname = fields.getTextInputValue("register-nickname-input");
        
        interaction.reply({
            ephemeral: true,
            embeds: [new EmbedBuilder({
                author: createEmbedAuthor({ user, property: "username" }), 
                color: hexToRgb(settings.colors.theme.primary),
                description: `Welcome ${name}, your nick in server is ${nickname}`
            })]
        });
    },
});
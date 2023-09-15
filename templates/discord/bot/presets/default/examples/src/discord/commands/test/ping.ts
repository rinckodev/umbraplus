import { settings } from "@/settings";
import { Command, Component } from "@discord/base";
import { createRow, hexToRgb } from "@magicyan/discord";
import { ApplicationCommandType, ButtonBuilder, ButtonStyle, EmbedBuilder } from "discord.js";

new Command({
    name: "ping", dmPermission,
    description: "reply with pong",
    type: ApplicationCommandType.ChatInput,
    async run(interaction){

        interaction.reply({ ephemeral, 
            embeds: [
                new EmbedBuilder({ 
                    description: "pong", 
                    color: hexToRgb(settings.colors.theme.primary) 
                })
            ],
            components: [
                createRow(
                    new ButtonBuilder({customId: "ping-button", label: "ping", style: ButtonStyle.Success})
                )
            ]
        });
    },
});

new Component({
    customId: "ping-button", type: "Button", cache: "cached",
    async run(interaction) {

        const { message: { embeds: [embed] }} = interaction;

        const description = embed.description == "ping" ? "pong" : "ping";

        interaction.update({ embeds: [
            new EmbedBuilder({ description, 
                color: hexToRgb(settings.colors.theme.primary) 
            })
        ]});
    },
});
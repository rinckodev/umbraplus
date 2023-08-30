import { createRow } from "@/discord/functions";
import { hexToRgb } from "@/functions";
import { settings } from "@/settings";
import { Command, Component } from "@discord/base";
import { ApplicationCommandType, ButtonBuilder, ButtonStyle, EmbedBuilder } from "discord.js";

export default new Command({
    name: "ping",
    description: "reply with pong",
    dmPermission: false,
    type: ApplicationCommandType.ChatInput,
    async run({ interaction }){

        interaction.reply({  ephemeral: true, 
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
    components: [
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
        })
    ],
});
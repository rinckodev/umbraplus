import { Command } from "@/discord/base";
import { settings } from "@/settings";
import { brBuilder, hexToRgb, spaceBuilder } from "@magicyan/discord";
import { ApplicationCommandType, EmbedBuilder, time } from "discord.js";

new Command({
    name: "admin",
    description: "Admin command",
    dmPermission,
    defaultMemberPermissions: ["Administrator"],
    type: ApplicationCommandType.ChatInput,
    async run(interaction){
        const { guild } = interaction;

        const roles = Array.from(guild.roles.cache.reverse().first(25).values());

        const embed = new EmbedBuilder({
            description: `The first ${roles.length} roles from Guild`,
            color: hexToRgb(settings.colors.theme.azoxo),
            fields: roles.map(
                role => ({
                    name: "\u200b", inline,
                    value: brBuilder(
                        role.toString(),
                        spaceBuilder("Color:", role.hexColor),
                        "Created at:",
                        time(role.createdAt, "D"),
                    )
                })
            )
        });

        interaction.reply({ ephemeral, embeds: [embed]});
    }
});
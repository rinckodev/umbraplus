import { settings } from "@/settings";
import { brBuilder, createEmbedAuthor, hexToRgb } from "@magicyan/discord";
import { ApplicationCommandType, EmbedBuilder, hyperlink } from "discord.js";
import { Command } from "../base";

new Command({
    name: "example", dmPermission,
    description: "Example command",
    type: ApplicationCommandType.ChatInput,
    async run(interaction){
        const { user } = interaction;

        const libMention = hyperlink(
            "@magicyan/discord",
            "https://github.com/rinckodev/magicyan/tree/main/packages/discord"
        );

        interaction.reply({ ephemeral, embeds: [new EmbedBuilder({
            author: createEmbedAuthor({ user }),
            color: hexToRgb(settings.colors.theme.success),
            description: brBuilder(
                "## Welcome to the awsome bot base",
                "- Create commands easily",
                "- Awsome command, event and component handler",
                `- Use ${libMention} lib`,
                "By [Rincko Dev](https://github.com/rinckodev)"
            )
        })]});
    },
});
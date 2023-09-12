import { Command } from "@/discord/base";
import { settings } from "@/settings";
import { createRow, hexToRgb } from "@magicyan/discord";
import { ApplicationCommandOptionType, ApplicationCommandType, ButtonBuilder, ButtonStyle, EmbedBuilder, codeBlock } from "discord.js";

new Command({
    name: "register",
    description: "Register system command",
    type: ApplicationCommandType.ChatInput,
    dmPermission: false,
    options: [
        {
            name: "setup",
            description: "Setup register system",
            type: ApplicationCommandOptionType.Subcommand,
        }
    ],
    async run(interaction) {
        const { options, channel } = interaction;

        if (!channel?.send){
            interaction.reply({ ephemeral: true,
                content: "This command cannot be used on this channel!"
            });
            return;
        }

        switch(options.getSubcommand(true)){
            case "setup":{
                await interaction.deferReply({ephemeral: true});
                const row = createRow(
                    // The function of this button is in @discord/components/buttons/register/button
                    new ButtonBuilder({
                        customId: "register-start-button", 
                        label: "Register", style: ButtonStyle.Primary
                    })
                );
                channel.send({
                    embeds: [new EmbedBuilder({
                        title: "Register System",
                        description: "Click the button below to register",
                        color: hexToRgb(settings.colors.theme.primary)
                    })],
                    components: [row],
                })
                .then(message => {
                    interaction.editReply({ content: `Message sent successfully! ${message.url}`});
                })
                .catch(err => {
                    interaction.editReply({ content: `An error occurred while trying to send the message! ${codeBlock("ts", err)}`});
                });
                return;
            }   
        }
    },
});
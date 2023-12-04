import { db } from "@/database";
import { Command } from "@/discord/base";
import { ApplicationCommandOptionType, ApplicationCommandType, ChannelType } from "discord.js";

new Command({
    name: "config",
    description: "Config command",
    dmPermission: false,
    defaultMemberPermissions: ["Administrator"],
    type: ApplicationCommandType.ChatInput,
    options:[
        {
            name: "logs",
            description: "Config logs system",
            type: ApplicationCommandOptionType.SubcommandGroup,
            options: [
                {
                    name: "channel",
                    description: "Set a logs channel",
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: "channel",
                            description: "Select a channel",
                            type: ApplicationCommandOptionType.Channel,
                            channelTypes: [ChannelType.GuildText],
                            required
                        }
                    ]
                }
            ]
        }
    ],
    async run(interaction){
        const { options, guild } = interaction;

        const group = options.getSubcommandGroup(true);
        const subCommand = options.getSubcommand(true);

        switch(group){
            case "logs":{
                switch(subCommand){
                    case "channel":{
                        const channel = options.getChannel("channel", true, [ChannelType.GuildText]);

                        await db.guilds.set(guild.id + ".logs.channel.id", channel.id);

                        interaction.reply({ ephemeral, content: "Logs channel defined successfully" });
                        return;
                    }
                }
                return;
            }
        }
    }
});
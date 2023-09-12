import { log, processEnv } from "@/settings";
import ck from "chalk";
import { ApplicationCommandType, AutocompleteInteraction, BitFieldResolvable, ChatInputCommandInteraction, Client, ClientOptions, CommandInteraction, GatewayIntentsString, IntentsBitField, MessageContextMenuCommandInteraction, Partials, UserContextMenuCommandInteraction, version } from "discord.js";
import { glob } from "glob";
import { join } from "node:path";
import { Command, Component, Event } from ".";

export function createClient(options?: ClientOptions): Client {
    const client = new Client({
        intents: Object.keys(IntentsBitField.Flags) as BitFieldResolvable<GatewayIntentsString, number>,
        partials: [Partials.Channel, Partials.GuildMember, Partials.Message, Partials.User, Partials.ThreadMember],
        failIfNotExists: false,
        ...options
    });
    client.start = async function() {
        const discordDir = join(__dirname, ".."); 
        const paths = await glob([
            "commands/**/*.{ts,js}",
            "events/**/*.{ts,js}",
            "components/**/*.{ts,js}",
        ], { cwd: discordDir });
        for(const path of paths) await import(join(discordDir, path));
        Event.all.forEach(({ run, name, once }) => once 
            ? this.once(name, run)
            : this.on(name, run)
        );
        this.login(processEnv.BOT_TOKEN);
    };

    client.on("interactionCreate", interaction => {
        const onAutoComplete = (autoCompleteInteraction: AutocompleteInteraction) => {
            const command = Command.all.get(autoCompleteInteraction.commandName);
            const interaction = autoCompleteInteraction as AutocompleteInteraction;
            if (command?.type == ApplicationCommandType.ChatInput && command.autoComplete){
                command.autoComplete(interaction);
            }
        };
        const onCommand = (commandInteraction: CommandInteraction) => {
            const command = Command.all.get(commandInteraction.commandName);
    
            switch(command?.type){
                case ApplicationCommandType.ChatInput:{
                    const interaction = commandInteraction as ChatInputCommandInteraction;
                    command.run(interaction);
                    return;
                }
                case ApplicationCommandType.Message:{
                    const interaction = commandInteraction as MessageContextMenuCommandInteraction;
                    command.run(interaction);
                    return;
                }
                case ApplicationCommandType.User:{
                    const interaction = commandInteraction as UserContextMenuCommandInteraction;
                    command.run(interaction);
                    return;
                }
            }
    
        };
        if (interaction.isCommand()) onCommand(interaction);
        if (interaction.isAutocomplete()) onAutoComplete(interaction);
        
        if (!interaction.isModalSubmit() && !interaction.isMessageComponent()) return;

        if (interaction.isModalSubmit()){
            const component = Component.find(interaction.customId, "Modal");
             component?.run(interaction); return;
        }
        if (interaction.isButton()) {
            const component = Component.find(interaction.customId, "Button");
            component?.run(interaction); return;
        }
        if (interaction.isStringSelectMenu()) {
            const component = Component.find(interaction.customId, "StringSelect");
            component?.run(interaction); return;
        }
        if (interaction.isChannelSelectMenu()) {
            const component = Component.find(interaction.customId, "ChannelSelect");
            component?.run(interaction); return;
        }
        if (interaction.isRoleSelectMenu()) {
            const component = Component.find(interaction.customId, "RoleSelect");
            component?.run(interaction); return;
        }
        if (interaction.isUserSelectMenu()) {
            const component = Component.find(interaction.customId, "UserSelect");
            component?.run(interaction); return;
        }
        if (interaction.isMentionableSelectMenu()) {
            const component = Component.find(interaction.customId, "MentionableSelect");
            component?.run(interaction); return;
        }
    });
    client.once("ready", async client => {
        console.log();
        log.success(`${ck.green("Bot online")} ${ck.blue.underline("discord.js")} 📦 ${ck.yellow(version)}`);
        log.info(`${ck.greenBright(`➝ Connected with ${ck.underline(client.user.username)}`)}`);
        console.log();
        
        await client.application.commands.set(Array.from(Command.all.values()))
        .then((c) => log.success(ck.green("Commands defined successfully!")))
        .catch(log.error);
    });
    return client;
}
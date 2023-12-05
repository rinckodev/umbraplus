import { ApplicationCommandType, AutocompleteInteraction, Client, ClientOptions, CommandInteraction, MessageComponentInteraction, ModalSubmitInteraction, Partials, version } from "discord.js";
import { CustomItents, brBuilder } from "@magicyan/discord";
import { Command, Component, Event, Modal } from "./";
import { log } from "@/settings";
import { glob } from "glob";
import { join } from "node:path";
import ck from "chalk";

export function createClient(options?: Partial<ClientOptions>): Client {
    const client = new Client({
        intents: CustomItents.All,
        partials: [
            Partials.Channel, 
            Partials.GuildScheduledEvent,
            Partials.GuildMember, 
            Partials.Message, 
            Partials.User, 
            Partials.ThreadMember
        ],
        failIfNotExists: false,
        ...options
    });
    client.start = async function(options) {
        client.once("ready", (client) => {
            whenReady(client);
            options?.whenReady?.(client);
        });
        const discordDir = join(__dirname, "..");
        const folders = [
            "commands/**/*.{ts,js}",
            "events/**/*.{ts,js}",
            "components/**/*.{ts,js}",
        ];
        const paths = await glob(folders, { cwd: discordDir });

        for (const path of paths) await import(join(discordDir, path));
        Event.all.forEach(({ run, name, once }) => once 
            ? this.once(name, run)
            : this.on(name, run)
        );
        this.login(process.env.BOT_TOKEN);
    };
    client.on("interactionCreate", interaction => {
        if (interaction.isCommand()) onCommand(interaction);
        if (interaction.isAutocomplete()) onAutoComplete(interaction);
        if (interaction.isMessageComponent()) onComponent(interaction);
        if (interaction.isModalSubmit()) onModal(interaction);
    });
    return client;
}
async function whenReady(client: Client<true>){
    console.log();
    log.success(brBuilder(
        `${ck.green("Bot online")} ${ck.blue.underline("discord.js")} 📦 ${ck.yellow(version)}`,
        `${ck.greenBright(`➝ Connected as ${ck.underline(client.user.username)}`)}`,
    ));
    console.log();
        
    await client.application.commands.set(
        Array.from(Command.all.values())
    )
    .then(() => log.success(ck.green("Commands registered successfully!")))
    .catch(log.error);
}
function onCommand(commandInteraction: CommandInteraction){
    const command = Command.all.get(commandInteraction.commandName);
    if (command) {
        command.run(commandInteraction as any);
        return;
    }
    log.warn(`Missing function to ${commandInteraction.commandName} command`);
}
function onAutoComplete(interaction: AutocompleteInteraction){
    const command = Command.all.get(interaction.commandName);
    if (command?.type !== ApplicationCommandType.ChatInput || !command.autoComplete) return;
    command.autoComplete(interaction as any);
}
function onComponent(interaction: MessageComponentInteraction){
    const component = Component.get(interaction.customId, interaction.componentType)
    ?? Component.logical.find(c => c.customId(interaction.customId));
    
    if (component) {
        component.run(interaction as any);
        return;
    }
    log.warn(`Missing function to ${interaction.customId} component`);
}
function onModal(interaction: ModalSubmitInteraction){
    const modal = Modal.get(interaction.customId)
    ?? Modal.logical.find(c => c.customId(interaction.customId));
    if (modal) {
        modal.run(interaction);
        return;
    }
    log.warn(`Missing function to ${interaction.customId} modal`);
}
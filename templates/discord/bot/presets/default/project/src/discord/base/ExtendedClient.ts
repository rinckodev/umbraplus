import { ApplicationCommandType, AutocompleteInteraction, BitFieldResolvable, ChatInputCommandInteraction, Client, ClientEvents, Collection, CommandInteraction, ComponentType, DiscordAPIError, ErrorEvent, GatewayIntentsString, IntentsBitField, Interaction, InteractionType, MessageContextMenuCommandInteraction, Partials, UserContextMenuCommandInteraction, version } from "discord.js";
import { glob } from "glob";
import { join } from "node:path";
import { Command } from "./Command";
import { Component } from "./Components";
import { Event } from "./Event";
import { processEnv } from "@/settings";
import { brBuilder } from "@/functions";
import ck from "chalk";

export class ExtendedClient<Ready extends boolean = boolean> extends Client<Ready> {
    public Commands: Collection<string, Command["data"]> = new Collection();
    public Buttons: Collection<string, Component["data"] & {type: "Button"}> = new Collection();
    public StringSelects: Collection<string, Component["data"] & {type: "StringSelect"}> = new Collection();
    public RoleSelect: Collection<string, Component["data"] & {type: "RoleSelect"}> = new Collection();
    public ChannelSelects: Collection<string, Component["data"] & {type: "ChannelSelect"}> = new Collection();
    public UserSelects: Collection<string, Component["data"] & {type: "UserSelect"}> = new Collection();
    public MentionableSelects: Collection<string, Component["data"] & {type: "MentionableSelect"}> = new Collection();
    public Modals: Collection<string, Component["data"] & {type: "Modal"}> = new Collection();
    constructor() {
        super({
            intents: Object.keys(IntentsBitField.Flags) as BitFieldResolvable<GatewayIntentsString, number>,
            partials: [Partials.Channel, Partials.GuildMember, Partials.Message, Partials.User, Partials.ThreadMember],
            failIfNotExists: false,
        });
        const { BOT_TOKEN } = processEnv;
        if (!BOT_TOKEN){
            throw new Error("TOKEN is undefined!");
        }
        
    }
    public async start(){
        await this.loadEvents();
        await this.loadComponents();
        await this.loadCommands();

        this.login(process.env.BOT_TOKEN);
        this.on("interactionCreate", this.registerListeners);
        this.once("ready", this.whenReady);
    }
    private async loadCommands(){
        const commandsDir = join(__dirname, "../commands");
        const paths = await getFiles(commandsDir);

        const messages: string[] = [ck.bgBlue(" Commands ")];

        for (const path of paths){
            const { default: command } = await import(join(commandsDir, path));
            if (!(command instanceof Command)) {
                messages.push(ck.italic.yellow(`! "${path}" file is not exporting a`, ck.green("Command")));
                continue;
            }

            this.Commands.set(command.data.name, command.data);
            messages.push(`${ck.green("✓")} ${ck.blue.underline(path)} ${ck.green(`registered as ${ck.cyan(command.data.name)}`)}`);

            if (command.data.components) {
                command.data.components.forEach(c => this.saveComponent(c));
            }
        }        
        console.log(messages.join("\n"));
    }
    private async loadEvents(){
        const eventsDir = join(__dirname, "../events");
        const paths = await getFiles(eventsDir);

        const messages: string[] = [ck.bgYellow.black(" Events ")];

        for (const path of paths){
            const { default: event } = await import(join(eventsDir, path));
            if (!(event instanceof Event)) {
                messages.push(ck.italic.yellow(`! "${path}" file is not exporting a`, ck.green("Event")));
                continue;
            }
            const client = this as ExtendedClient<true>;
            const { name, run, once } = event.data;
            if (once){
                this.once(name, (...args) => run(client, ...args));
            } else {
                this.on(name, (...args) => run(client, ...args));
            }

            messages.push(`${ck.green("✓")} ${ck.yellow.underline(path)} ${ck.green(`registered as ${ck.cyan(event.data.name)}`)}`);
        }

        console.log(messages.join("\n"));
    }
    private async loadComponents(){
        const componentsDir = join(__dirname, "../components");
        const paths = await getFiles(componentsDir);

        const messages: string[] = [ck.bgGreenBright.black(" Components ")];

        for (const path of paths){
            const { default: component } = await import(join(componentsDir, path));
            if (!(component instanceof Component)) {
                messages.push(ck.italic.yellow(`! "${path}" file is not exporting a`, ck.green("Component")));
                continue;
            }

            this.saveComponent(component);
            messages.push(`${ck.green("✓")} ${ck.greenBright.underline(path)} ${ck.green(`registered as ${ck.cyan(component.data.customId)}`)}`);
        }        
        console.log(messages.join("\n"));
    }
    private async saveComponent({ data: component }: Component){
        switch (component.type) {
            case "Button": this.Buttons.set(component.customId, component);
                break;
            case "StringSelect": this.StringSelects.set(component.customId, component);
                break;
            case "RoleSelect": this.RoleSelect.set(component.customId, component);
                break;
            case "ChannelSelect": this.ChannelSelects.set(component.customId, component);
                break;
            case "UserSelect": this.UserSelects.set(component.customId, component);
                break;
            case "MentionableSelect": this.MentionableSelects.set(component.customId, component);
                break;
            case "Modal": this.Modals.set(component.customId, component);
                break;
        }
    }
    private async registerListeners(interaction: Interaction){
        if (interaction.isCommand()) this.onCommand(interaction);
        if (interaction.isAutocomplete()) this.onAutoComplete(interaction);

        if (interaction.isModalSubmit()){
            this.Modals.get(interaction.customId)?.run(interaction);
            return;
        }

        if (interaction.isMessageComponent()){
            switch(interaction.componentType){
                case ComponentType.Button: this.Buttons.get(interaction.customId)?.run(interaction);
                    break;
                case ComponentType.StringSelect: this.StringSelects.get(interaction.customId)?.run(interaction);
                    break;
                case ComponentType.UserSelect: this.UserSelects.get(interaction.customId)?.run(interaction);
                    break;
                case ComponentType.RoleSelect: this.RoleSelect.get(interaction.customId)?.run(interaction);
                    break;
                case ComponentType.MentionableSelect: this.MentionableSelects.get(interaction.customId)?.run(interaction);
                    break;
                case ComponentType.ChannelSelect: this.ChannelSelects.get(interaction.customId)?.run(interaction);
                    break;
            }
            return;
        }
    }
    private onAutoComplete(autoCompleteInteraction: AutocompleteInteraction) {
        const command = this.Commands.get(autoCompleteInteraction.commandName);
        const client = this as ExtendedClient<true>;
        const interaction = autoCompleteInteraction as AutocompleteInteraction;
        if (command?.type == ApplicationCommandType.ChatInput && command.autoComplete){
            command.autoComplete({ client, interaction });
        }
    }
    private async onCommand(commandInteraction: CommandInteraction){
        const command = this.Commands.get(commandInteraction.commandName);
        const client = this as ExtendedClient<true>;

        switch(command?.type){
            case ApplicationCommandType.ChatInput:{
                const interaction = commandInteraction as ChatInputCommandInteraction;
                command.run({ interaction, client });
                return;
            }
            case ApplicationCommandType.Message:{
                const interaction = commandInteraction as MessageContextMenuCommandInteraction;
                command.run({ interaction, client });
                return;
            }
            case ApplicationCommandType.User:{
                const interaction = commandInteraction as UserContextMenuCommandInteraction;
                command.run({ interaction, client });
                return;
            }
        }

    }
    private async whenReady(client: Client<true>){
        const messages: string[] = [];
        
        messages.push(
            `${ck.green("✓ Bot online")} ${ck.blue.underline("discord.js")} 📦 ${ck.yellow(version)}`,
            `${ck.greenBright(`➝ Connected with ${ck.underline(client.user.username)}`)}`
        );
        
        await client.application.commands.set(Array.from(this.Commands.values()))
        .then((c) => messages.push(`${ck.cyan("⟨ / ⟩")} ${ck.green(`${c.size} commands defined successfully!`)}`))
        .catch(({ message }: DiscordAPIError) => messages.push(brBuilder("",
            ck.bgRed.white(" ✗ An error occurred while trying to set the commands "),
            ck.red("Message:", message),
        )));

        console.log(brBuilder("", ...messages));
    }
}

async function getFiles(filesDirectory: string){
    return await glob("**/*.{ts,js}", {
        cwd: filesDirectory
    });
}
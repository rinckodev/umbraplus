import chalk from "chalk";
import { ApplicationCommandType, AutocompleteInteraction, BitFieldResolvable, ChatInputCommandInteraction, Client, ClientEvents, Collection, CommandInteraction, ComponentType, GatewayIntentsString, IntentsBitField, Interaction, InteractionType, MessageContextMenuCommandInteraction, Partials, UserContextMenuCommandInteraction, version } from "discord.js";
import "dotenv/config";
import { glob } from "glob";
import { join } from "path";
import { Command } from "./Command";
import { Component } from "./Components";
import { Event } from "./Event";

export class ExtendedClient<Ready extends boolean = boolean> extends Client<Ready> {
    public Commands: Collection<string, Command["data"]> = new Collection();
    public Buttons: Collection<string, Component["data"] & {type: "Button"}> = new Collection();
    public StringSelects: Collection<string, Component["data"] & {type: "StringSelect"}> = new Collection();
    public RoleSelect: Collection<string, Component["data"] & {type: "RoleSelect"}> = new Collection();
    public ChannelSelects: Collection<string, Component["data"] & {type: "ChannelSelect"}> = new Collection();
    public UserSelects: Collection<string, Component["data"] & {type: "UserSelect"}> = new Collection();
    public MentionableSelects: Collection<string, Component["data"] & {type: "MentionableSelect"}> = new Collection();
    public Modals: Collection<string, Component["data"] & {type: "Modal"}> = new Collection();
    public mainGuildId: string;
    constructor() {
        super({
            intents: Object.keys(IntentsBitField.Flags) as BitFieldResolvable<GatewayIntentsString, number>,
            partials: [Partials.Channel, Partials.GuildMember, Partials.Message, Partials.User, Partials.ThreadMember],
            failIfNotExists: false,
        });
        const { MAIN_GUILD_ID, BOT_TOKEN } = process.env;
        if (!MAIN_GUILD_ID || !BOT_TOKEN){
            throw new Error("TOKEN or MAIN GUILD ID undefined!");
        }
        this.mainGuildId = MAIN_GUILD_ID;
        
    }
    public async start(){
        console.log(chalk.cyan("🧰 Preparing..."));

        await this.loadEvents();
        await this.loadComponents();
        await this.loadCommands();

        this.login(process.env.BOT_TOKEN);
        this.on("ready", this.whenReady);
        this.on("interactionCreate", this.registerListeners);
    }
    private async loadCommands(){
        const commandsDir = join(__dirname, "../commands");
        const paths = await getFiles(commandsDir);

        const messages: string[] = [chalk.bgBlue(" Commands ")];

        for (const path of paths){
            const { default: command }: { default: Command } = await import(join(commandsDir, path));
            if (!command?.data?.name) {
                messages.push(chalk.italic.yellow(`! "${path}" file is not exporting a Command`));
                continue;
            }

            this.Commands.set(command.data.name, command.data);
            messages.push(`${chalk.green("✓")} ${chalk.blue.underline(path)} ${chalk.green(`registered as ${chalk.cyan(command.data.name)}`)}`);

            if (command.data.components) {
                command.data.components.forEach(c => this.saveComponent(c));
            }
        }        
        console.log(messages.join("\n"));
    }
    private async loadEvents(){
        const eventsDir = join(__dirname, "../events");
        const paths = await getFiles(eventsDir);

        const messages: string[] = [chalk.bgYellow.black(" Events ")];

        for (const path of paths){
            const { default: event }: { default: Event<keyof ClientEvents> } = await import(join(eventsDir, path));
            if (!event?.data) {
                messages.push(chalk.italic.yellow(`! "${path}" file is not exporting a Event`));
                continue;
            }

            if (event.data.once) this.once(event.data.name, event.data.run);
            else this.on(event.data.name, event.data.run);

            messages.push(`${chalk.green("✓")} ${chalk.yellow.underline(path)} ${chalk.green(`registered as ${chalk.cyan(event.data.name)}`)}`);
        }

        console.log(messages.join("\n"));
    }
    private async loadComponents(){
        const componentsDir = join(__dirname, "../components");
        const paths = await getFiles(componentsDir);

        const messages: string[] = [chalk.bgGreenBright.black(" Components ")];

        for (const path of paths){
            const { default: component }: { default: Component } = await import(join(componentsDir, path));
            if (!component?.data?.customId) {
                messages.push(chalk.italic.yellow(`! "${path}" file is not exporting a Component`));
                continue;
            }

            this.saveComponent(component);
            messages.push(`${chalk.green("✓")} ${chalk.greenBright.underline(path)} ${chalk.green(`registered as ${chalk.cyan(component.data.customId)}`)}`);
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
    private async whenReady(client: Client<true>){
        const messages: string[] = [];
        
        messages.push(`${chalk.green("✓ Bot online")} ${chalk.blue.underline("discord.js")} 📦 ${chalk.yellow(version)}`);
        
        await client.application.commands.set(Array.from(this.Commands.values()))
        .then((c) => messages.push(`${chalk.cyan("⟨ / ⟩")} ${chalk.green(`${c.size} commands defined successfully!`)}`))
        .catch(err => messages.push(chalk.red(`✗ An error occurred while trying to set the commands \n${err}`)));

        console.log("\n", messages.join("\n"));
    }
    private async registerListeners(interaction: Interaction){
        if (interaction.isCommand()) this.onCommand(interaction);

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
    private async onCommand(commandInteraction: CommandInteraction){
        const command = this.Commands.get(commandInteraction.commandName);
        const client = this as ExtendedClient<true>;

        switch(command?.type){
            case ApplicationCommandType.ChatInput:{
                if (commandInteraction.isAutocomplete() && command.autoComplete){
                    const interaction = commandInteraction as AutocompleteInteraction;
                    command.autoComplete({ interaction, client });
                    return;
                }
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
}

async function getFiles(filesDirectory: string){
    return await glob("**/*.{ts,js}", {cwd: filesDirectory});
}
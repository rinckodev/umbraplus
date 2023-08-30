import { ApplicationCommandData, ApplicationCommandType, AutocompleteInteraction, ChatInputCommandInteraction, MessageContextMenuCommandInteraction, UserContextMenuCommandInteraction } from "discord.js";
import { Component } from "./Components";
import { ExtendedClient } from "./ExtendedClient";

type CommandProps<DmPermission extends boolean> =
{
    type: ApplicationCommandType.ChatInput,
    autoComplete?(props: {
        client: ExtendedClient<true>,
        interaction: DmPermission extends false 
        ? AutocompleteInteraction<"cached">
        : AutocompleteInteraction
    }): any
    run(props: {
        client: ExtendedClient<true>,
        interaction: DmPermission extends false 
        ? ChatInputCommandInteraction<"cached">
        : ChatInputCommandInteraction
    }): any
} | {
    type: ApplicationCommandType.User,
    run(props: {
        client: ExtendedClient<true>,
        interaction: DmPermission extends false 
        ? UserContextMenuCommandInteraction<"cached">
        : UserContextMenuCommandInteraction,
    }): any
} | {
    type: ApplicationCommandType.Message,
    run(props: { 
        client: ExtendedClient<true>,
        interaction: DmPermission extends false 
        ? MessageContextMenuCommandInteraction<"cached">
        : MessageContextMenuCommandInteraction
    }): any
}

type CommandData<DmPermission extends boolean> = CommandProps<DmPermission> & ApplicationCommandData & {
    dmPermission: DmPermission,
    components?: Component[],
}

export class Command<DmPermission extends boolean = boolean>{
    constructor(public data: CommandData<DmPermission>){}
}
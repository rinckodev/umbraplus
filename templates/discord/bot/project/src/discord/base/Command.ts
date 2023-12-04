import { ApplicationCommandData, ApplicationCommandType, AutocompleteInteraction, CacheType, ChatInputCommandInteraction, Collection, MessageContextMenuCommandInteraction, UserContextMenuCommandInteraction } from "discord.js";
import { log } from "@/settings";
import ck from "chalk";

type isCached<B extends boolean | undefined = undefined> = 
B extends true ? "raw" : B extends false ? "cached" : CacheType;

type CommandProps<DmPermission extends boolean> =
{
    name: Lowercase<string>;
    type: ApplicationCommandType.ChatInput,
    autoComplete?(interaction: AutocompleteInteraction<isCached<DmPermission>>): any
    run(interaction: ChatInputCommandInteraction<isCached<DmPermission>>): any
} | {
    type: ApplicationCommandType.User,
    run(interaction: UserContextMenuCommandInteraction<isCached<DmPermission>>): any
} | {
    type: ApplicationCommandType.Message,
    run(interaction: MessageContextMenuCommandInteraction<isCached<DmPermission>>): any
}

type CommandData<DmPermission extends boolean> = CommandProps<DmPermission> & ApplicationCommandData & {
    dmPermission?: DmPermission,
}

export class Command<DmPermission extends boolean = boolean> {
    public static all: Collection<string, CommandData<boolean>> = new Collection();
    constructor(public data: CommandData<DmPermission>){
        log.success(ck.green(`${ck.blue.underline(data.name)} command registered successfully!`));
        Command.all.set(data.name, data);
    }
}
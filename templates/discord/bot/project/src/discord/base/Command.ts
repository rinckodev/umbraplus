import { ApplicationCommandData, ApplicationCommandType, AutocompleteInteraction, CacheType, ChatInputCommandInteraction, Collection, ComponentType, MessageContextMenuCommandInteraction, UserContextMenuCommandInteraction } from "discord.js";
import { log } from "@/settings";
import ck from "chalk";

type GetCache<D> = D extends false ? "cached" : CacheType;

type CommandProps<D, Store> =
{
    name: Lowercase<string>;
    type: ApplicationCommandType.ChatInput,
    autoComplete?(interaction: AutocompleteInteraction<GetCache<D>>, store: Store): any
    run(interaction: ChatInputCommandInteraction<GetCache<D>>, store: Store): any
} | {
    type: ApplicationCommandType.User,
    run(interaction: UserContextMenuCommandInteraction<GetCache<D>>, store: Store): any
} | {
    type: ApplicationCommandType.Message,
    run(interaction: MessageContextMenuCommandInteraction<GetCache<D>>, store: Store): any
}

type CommandStoreOptions = Map<any, any> | Set<any> | Collection<any, any> | Array<any>; 
type CommandStore = Record<string, CommandStoreOptions>;

type CommandData<D extends boolean, Store extends CommandStore> = CommandProps<D, Store> & ApplicationCommandData & {
    dmPermission?: D,
    store?: Store;
}

export class Command<D extends boolean, Store extends CommandStore = CommandStore> {
    public static commands: Collection<string, CommandData<boolean, CommandStore>> = new Collection();
    constructor(public data: CommandData<D, Store>){
        log.success(ck.green(`${ck.blue.underline(data.name)} command registered successfully!`));
        Command.commands.set(data.name, data);
    }
}
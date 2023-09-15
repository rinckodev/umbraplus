import { log } from "@/settings";
import ck from "chalk";
import { ButtonInteraction, CacheType, ChannelSelectMenuInteraction, Collection, MentionableSelectMenuInteraction, ModalSubmitInteraction, RoleSelectMenuInteraction, StringSelectMenuInteraction, UserSelectMenuInteraction } from "discord.js";

type ComponentProps<Cached extends CacheType = CacheType> = {
    type: "Button",
    run(interaction: ButtonInteraction<Cached>): any;
} | {
    type: "StringSelect",
    run(interaction: StringSelectMenuInteraction<Cached>): any;
} | {
    type: "RoleSelect",
    run(interaction: RoleSelectMenuInteraction<Cached>): any;
} | {
    type: "ChannelSelect",
    run(interaction: ChannelSelectMenuInteraction<Cached>): any;
} | {
    type: "UserSelect",
    run(interaction: UserSelectMenuInteraction<Cached>): any;
} | {
    type: "MentionableSelect",
    run(interaction: MentionableSelectMenuInteraction<Cached>): any;
} | {
    type: "Modal",
    run(interaction: ModalSubmitInteraction<Cached>): any;
}

type ComponentData<Cached extends CacheType = CacheType> = ComponentProps<Cached> & {
    cache?: Cached,
    customId: string,
}

export class Component<Cached extends CacheType = CacheType> {
    public static all: Collection<string, ComponentData> = new Collection();
    public static find<T extends ComponentData["type"]>(customId: string, type: T){
        const c =  Component.all.find(c => c.customId === customId && c.type == type);
        return c as ComponentData & { type: T } | undefined;
    }
    constructor(data: ComponentData<Cached>){
        log.successComponent(ck.green(`${ck.cyan.underline(data.customId)} has been successfully saved!`));
        Component.all.set(data.customId, data);
    }
}
import { ButtonInteraction, CacheType, ChannelSelectMenuInteraction, MentionableSelectMenuInteraction, ModalSubmitInteraction, RoleSelectMenuInteraction, StringSelectMenuInteraction, UserSelectMenuInteraction } from "discord.js";

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

export type ComponentData<Cached extends CacheType = CacheType> = ComponentProps<Cached> & {
    cache?: Cached,
    customId: string,
}

export class Component<Cached extends CacheType = CacheType> {
    constructor(public readonly data: ComponentData<Cached>){}
}
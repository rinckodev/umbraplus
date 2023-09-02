import { ActionRowBuilder, AnyComponentBuilder, ButtonBuilder, ButtonStyle, LinkButtonComponentData, TextInputBuilder, TextInputComponentData } from "discord.js";

export function createRow<Component extends AnyComponentBuilder = AnyComponentBuilder>(...components: Component[]){
    return new ActionRowBuilder<Component>({components});
}

export function createLinkButton(data: Omit<LinkButtonComponentData, "style" | "type">){
    return new ButtonBuilder({style: ButtonStyle.Link, ...data});
}

export function createModalInput(input: Partial<Omit<TextInputComponentData, "type">>){
    return new ActionRowBuilder<TextInputBuilder>({components: [new TextInputBuilder(input)]});
}
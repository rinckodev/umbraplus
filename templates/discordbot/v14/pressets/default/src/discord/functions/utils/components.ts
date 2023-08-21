import { ActionRowBuilder, AnyComponentBuilder, ButtonBuilder, ButtonStyle, LinkButtonComponentData } from "discord.js";

export function createRow<Component extends AnyComponentBuilder = AnyComponentBuilder>(...components: Component[]){
    return new ActionRowBuilder<Component>({components});
}

export function linkButton(data: Omit<LinkButtonComponentData, "style" | "type">){
    return new ButtonBuilder({style: ButtonStyle.Link, ...data});
}
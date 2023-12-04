import { log } from "@/settings";
import ck from "chalk";
import { CacheType, Collection, ModalMessageModalSubmitInteraction, ModalSubmitInteraction } from "discord.js";

type GetInteraction<C extends CacheType = CacheType, M extends boolean = boolean> = 
M extends true ? ModalMessageModalSubmitInteraction<C> : ModalSubmitInteraction<C>

type CustomIdFunction = (customId: string) => boolean

type ComponentStringIdentifier = {
    customId: string;
}
type ComponentFunctionIdentifier = {
    name: string;
    customId: CustomIdFunction;
}

type ComponentIdentifier = ComponentStringIdentifier | ComponentFunctionIdentifier

type ModalData<C extends CacheType = CacheType, M extends boolean = boolean> = {
    cache?: C
    isFromMessage?: M;
    run(interaction: GetInteraction<C, M>): any
} & ComponentIdentifier

export class Modal<C extends CacheType = CacheType, M extends boolean = boolean>{
    private static all: Collection<string, ModalData> = new Collection();
    public static get(customId: string){
        return Modal.all.get(customId);
    }
    public static logical: Array<ModalData & { customId: CustomIdFunction }> = [];
    constructor(data: ModalData<C, M>){
        log.success(
            ck.green(`${ck.cyan.underline(data.customId)} modal registered successfully!`)
        );
        typeof data.customId == "string" 
        ? Modal.all.set(data.customId, data)
        : Modal.logical.push(data as any);
    }
}
import { log } from "@/settings";
import ck from "chalk";
import { ClientEvents, Collection } from "discord.js";

type EventData<Key extends keyof ClientEvents> = {
    name: Key,
    once?: boolean,
    run(...args: ClientEvents[Key]): any,
}

export class Event<Key extends keyof ClientEvents> {
    public static all: Collection<string, EventData<keyof ClientEvents>> = new Collection();
    constructor(data: EventData<Key>){
        log.successEvent(ck.green(`${ck.cyan.underline(data.name)} has been successfully registered!`));
        Event.all.set(data.name, data);
    }
}
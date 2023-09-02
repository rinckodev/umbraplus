import { ClientEvents } from "discord.js";
import { ExtendedClient } from "./ExtendedClient";

export type EventData<Key extends keyof ClientEvents> = {
    name: Key,
    once?: boolean,
    run(client: ExtendedClient<true>, ...args: ClientEvents[Key]): any,
}

export class Event<Key extends keyof ClientEvents> {
    constructor(public data: EventData<Key>){}
}
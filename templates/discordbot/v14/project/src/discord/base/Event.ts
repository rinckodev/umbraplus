import { ClientEvents } from "discord.js";

export type EventData<Key extends keyof ClientEvents> = {
    name: Key,
    once?: boolean,
    run(...args: ClientEvents[Key]): any,
}

export class Event<Key extends keyof ClientEvents> {
    constructor(public data: EventData<Key>){}
}
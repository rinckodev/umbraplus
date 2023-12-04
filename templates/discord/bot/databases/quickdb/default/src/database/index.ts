import { QuickDB } from "quick.db";
import { GuildData } from "./interfaces/GuildData";
import { UserData } from "./interfaces/UserData";

const filePath = rootTo("localdb.sqlite");

const db = {
    guilds: new QuickDB<GuildData>({ filePath, table: "guilds" }),
    users: new QuickDB<UserData>({ filePath, table: "users" })
};

export * from "./interfaces/GuildData";
export * from "./interfaces/UserData";
export { db };
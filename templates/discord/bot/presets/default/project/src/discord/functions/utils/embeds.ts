import { ImageURLOptions, User } from "discord.js";

export function createEmbedAuthor({ user, property="displayName", imageSize: size=512 }: {
    user: User,
    property?: keyof Pick<User, "username" | "displayName" | "id">
    imageSize?: ImageURLOptions["size"],
}){
    return { name: user[property], iconUrl: user.displayAvatarURL({ size }) };
}
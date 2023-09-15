import { ApplicationCommandType } from "discord.js";
import { db } from "@/database";
import { Command } from "@/discord/base";

new Command({
    name: "profile",
    description: "See your profile",
    dmPermission,
    type: ApplicationCommandType.ChatInput,
    async run(interaction) {
        const { user } = interaction;
        const userData = await db.get(db.users, user.id);

        if (!userData){
            interaction.reply({ ephemeral, content: "Not registered! Use /register" });
            return;
        }

        interaction.reply({ ephemeral, content: `Coins ${userData.wallet?.coins || 0}`});

    },
});
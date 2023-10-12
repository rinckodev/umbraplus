import { ApplicationCommandType, ModalBuilder, TextInputStyle } from "discord.js";
import { db } from "@/database";
import { Command, Component } from "@/discord/base";
import { createModalInput } from "@magicyan/discord";

new Command({
    name: "register",
    description: "Register command",
    dmPermission,
    type: ApplicationCommandType.ChatInput,
    async run(interaction) {
        const { user } = interaction;
        const userData = await db.get(db.users, user.id);

        if (userData){
            interaction.reply({ ephemeral, content: "You already registerd!" });
            return;
        }

        interaction.showModal(new ModalBuilder({
            customId: "register-modal",
            title: "Register",
            components: [
                createModalInput({
                    customId: "register-displayname",
                    label: "Display name",
                    placeholder: "Enter your display name",
                    style: TextInputStyle.Short
                })
            ]
        }));
    },
});

new Component({
    customId: "register-modal",
    type: "Modal", cache: "cached",
    async run(interaction) {
        const { fields, user } = interaction;
        
        const displayName = fields.getTextInputValue("register-displayname");
        
        await db.set(db.users, user.id, {
            username: user.username,
            displayName, wallet: {
                coins: 50, credits: 0,
            }
        });

        interaction.reply({ ephemeral, 
            content: "You earned 50 coins for registering, see using `/profile`"
        });
        
    },
});
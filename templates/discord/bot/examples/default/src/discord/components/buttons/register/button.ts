import { Component } from "@/discord/base";
import { ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } from "discord.js";

new Component({
    customId: "register-start-button",
    type: "Button",
    async run(interaction) {
        // The function of this modal is in @discord/components/buttons/register/modal
        interaction.showModal(new ModalBuilder({
            customId: "register-start-modal",
            title: "Start register",
            components: [
                new ActionRowBuilder<TextInputBuilder>({components: [
                    new TextInputBuilder({
                        customId: "register-name-input",
                        label: "Name",
                        placeholder: "Your name",
                        style: TextInputStyle.Short,
                        required: true
                    })
                ]}),
                new ActionRowBuilder<TextInputBuilder>({components: [
                    new TextInputBuilder({
                        customId: "register-nickname-input",
                        label: "Nickname",
                        placeholder: "Your nickname",
                        style: TextInputStyle.Short,
                        required: true
                    })
                ]}),
            ]
        }));
    },
});
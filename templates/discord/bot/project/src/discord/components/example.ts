import { Component } from "@/discord/base";
import { ComponentType } from "discord.js";

new Component({
    customId: "example-component-button",
    type: ComponentType.Button, cache: "cached",
    async run(interaction) {
        interaction.reply({ ephemeral, content: "This is a button component!"});
    },
});
import { Component } from "@/discord/base";

new Component({
    customId: "example-component-button",
    type: "Button", cache: "cached",
    async run(interaction) {
        interaction.reply({ ephemeral: true, content: "This is a button component!"});
    },
});
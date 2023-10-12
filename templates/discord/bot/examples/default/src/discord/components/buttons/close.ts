import { Component } from "@/discord/base";
import { log } from "@/settings";

new Component({
    customId: "global-close-button",
    type: "Button", cache: "cached",
    async run(interaction) {
        await interaction.deferUpdate();
        interaction.message.delete().catch(log.error);
    },
});
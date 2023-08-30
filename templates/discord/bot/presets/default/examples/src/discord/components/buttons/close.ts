import { Component } from "@/discord/base";
import { onCrash } from "@/functions";

export default new Component({
    customId: "global-close-button",
    type: "Button", cache: "cached",
    async run(interaction) {
        await interaction.deferUpdate();
        interaction.message.delete().catch(onCrash);
    },
});
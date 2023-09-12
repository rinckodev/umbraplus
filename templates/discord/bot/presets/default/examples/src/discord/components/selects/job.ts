import { Component } from "@/discord/base";

new Component({
    customId: "job-select",
    cache: "cached",
    type: "StringSelect",
    async run(interaction) {
        const { values: [selected] } = interaction;

        // do things...
    },
});
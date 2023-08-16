import { Component } from "@/discord/base";

export default new Component({
    customId: "job-select",
    cache: "cached",
    type: "StringSelect",
    async run(interaction) {
        const { values: [selected] } = interaction;

        // do things...
    },
});
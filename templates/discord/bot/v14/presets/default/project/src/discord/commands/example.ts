import { Command } from "@discord/base";
import { ApplicationCommandOptionType, ApplicationCommandType } from "discord.js";

// export default new Command({
//     name: "example",
//     description: "Example command",
//     dmPermission: false,
//     type: ApplicationCommandType.ChatInput,
//     async run({interaction}){
//         interaction.reply({ephemeral: true, content: "This is a example command!"});
//     }
// });

export default new Command({
    name: "pop",
    description: "popç",
    dmPermission: false,
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: "test",
            description: "ewae",
            type: ApplicationCommandOptionType.Attachment
        }
    ],
    async run({ interaction }){
        const { options } = interaction;
        
    }
});
# Awsome Bot Base
* [This project was generated using Umbra Plus CLI](https://github.com/rinckodev/umbraplus)

This is a very complete discord bot base created by [@rinckodev](https://github.com/rinckodev), you have the typescript features in action when developing commands and systems for your bot, to start just add your token in the .env file and use the scripts from package.json

[Setup your application](docs/setup-your-application.md)

## Scripts
```
npm run dev
npm run build
npm run start
```

## Structs

### Command
Use the Command class to create a new slash or context command.
Create the commands inside the "discord/commands" directory and use export default
```ts
import { Command } from "@/discord/base";
import { ApplicationCommandType } from "discord.js";

export default new Command({
    name: "ping",
    description: "ping command",
    type: ApplicationCommandType.ChatInput,
    dmPermission: false,
    run({ interaction, client }) {
        interaction.reply({
            ephemeral: true,
            content: `Ping: ${client.ws.ping}`
        }); 
    },
});
```

### Events
To create a function for an event, use the Event class, then just pass the event name and define the run function.
Create the events inside the "discord/events" directory and use export default
```ts
import { Event } from "@discord/base";

export default new Event({
    name: "guildMemberAdd",
    run(client, member) {
        console.log(`New member ${member.user.username}`);
    },
});
```
```ts
export default new Event({
    name: "voiceStateUpdate",
    run(client, oldState, newState) {
        console.log(oldState.channel);
    },
});
```

### Compoentns
Components include all discord components and the discord modal. Create using the Component class
Create the components inside the "discord/components" directory and use export default
```ts
import { Component } from "@/discord/base";
import { hexToRgb } from "@/functions";
import { settings } from "@/settings";
import { EmbedBuilder } from "discord.js";

export default new Component({
    customId: "register-start-modal",
    type: "Modal", cache: "cached",
    async run(interaction) {
        const { fields } = interaction;
        const nickname = fields.getTextInputValue("register-nickname-input");
        
        interaction.reply({
            ephemeral: true,
            content: `${nickname} saved!`
        });
    },
});
```

You can create the components within the commands to facilitate visualization or be able to use variables from the file without having to export them.
Use the Component class inside the components property of the Command class constructor
```ts
import { Command, Component } from "@/discord/base";
import { ActionRowBuilder, ApplicationCommandOptionType, ApplicationCommandType, Attachment, AttachmentBuilder, Collection, CommandInteractionOptionResolver, EmbedBuilder, ModalBuilder, TextChannel, TextInputBuilder, TextInputStyle, codeBlock } from "discord.js";

const members: Collection<string, Attachment> = new Collection();

export default new Command({
    name: "post",
    description: "Post command",
    type: ApplicationCommandType.ChatInput,
    dmPermission: false,
    options: [
        {
            name: "image",
            description: "Image",
            type: ApplicationCommandOptionType.Attachment,
            required: true,
        }
    ],
    run({ interaction }) {
        const { member, options } = interaction;

        const image = options.getAttachment("image", true);

        members.set(member.id, image);

        interaction.showModal(new ModalBuilder({
            customId: "post-modal",
            title: "Post",
            components: [
                new ActionRowBuilder<TextInputBuilder>({components: [
                    new TextInputBuilder({
                        customId: "post-title-input",
                        label: "Title",
                        style: TextInputStyle.Short,
                        required: true
                    })
                ]}),
                new ActionRowBuilder<TextInputBuilder>({components: [
                    new TextInputBuilder({
                        customId: "post-description-modal",
                        label: "Description",
                        style: TextInputStyle.Paragraph,
                        required: true
                    })
                ]}),
            ]
        }));
    },
    components: [
        new Component({
            customId: "post-modal", 
            type: "Modal", cache: "cached",
            async run(interaction) {
                const { member, fields, guild } = interaction;
                
                const image = members.get(member.id);
                if (!image){
                    interaction.reply({
                        ephemeral: true,
                        content: "Initial image not found! Use /post again"
                    });
                    return;
                }
                
                const title = fields.getTextInputValue("post-title-input");
                const description = fields.getTextInputValue("post-description-input");

                const channel = guild.channels.cache.get("1086511902173171752") as TextChannel;

                await interaction.deferReply({ephemeral: true});

                await channel.send({
                    embeds: [
                        new EmbedBuilder({
                            title, description,
                            image: { url: "attachment://image.png" }
                        })
                    ],
                    files:[
                        new AttachmentBuilder(image.url, {name: "image.png"})
                    ]
                })
                .then(message => {
                    interaction.editReply({content: `New post ${message.url}`});
                })
                .catch(err => {
                    interaction.editReply({content: `Error: ${codeBlock(err)}`});
                });
                members.delete(member.id);
            }, 
        })
    ]
});
```

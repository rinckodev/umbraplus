# Awsome Bot Base
* [This project was generated using Umbra Plus CLI](https://github.com/rinckodev/umbraplus)

This is a very complete discord bot base created by [@rinckodev](https://github.com/rinckodev), you have the typescript features in action when developing commands and systems for your bot, to start just add your token in the .env file and use the scripts from package.json

[Setup your application](docs/setup-your-application.md)

[Create firestore database](docs/create-firestore-database.md)

## Scripts
```
npm run dev
npm run build
npm run start
```

## Structs
The structure of this base allows you to create commands, components and events in any folder inside the "src/discord/" directory. But it's good to maintain an organization of your commands and systems by defining each thing in a respective directory
src/discord/commands
src/discord/components
src/discord/events

There is no need to export class instances. The handler will import all the files within the "src/discord/" directory, the classes will add their instances within a static property that exists in each of the classes, so they can be retrieved from the handler immediately

### Command
Use the Command class to create a new slash or context command.
Create a new instance of the class passing your command options
```ts
// src/discord/commands/public/ping.ts
import { Command } from "@/discord/base";
import { ApplicationCommandType } from "discord.js";

new Command({
    name: "ping",
    description: "ping command",
    type: ApplicationCommandType.ChatInput,
    dmPermission: false,
    run(interaction) {
        interaction.reply({
            ephemeral: true,
            content: `Ping: ${client.ws.ping}`
        }); 
    },
});
```

### Events
To create a function for an event, use the Event class, then just pass the event name and define the run function.
Create a new instance of the class passing your event options
```ts
// src/discord/events/server/onJoin.ts
import { Event } from "@discord/base";

new Event({
    name: "guildMemberAdd",
    run(member) {
        console.log(`New member ${member.user.username}`);
    },
});
```
```ts
// src/discord/events/voice/onJoinOrLeave.ts
new Event({
    name: "voiceStateUpdate",
    run(oldState, newState) {
        console.log(oldState.channel?.name);
        console.log(newState.channel?.name);
    },
});
```

### Compoentns
Components include all discord components and the discord modal. Create using the Component class
Create a new instance of the class passing your component options

```ts
// src/discord/components/modals/register.ts
import { Component } from "@/discord/base";
import { hexToRgb } from "@magicyan/discord";
import { settings } from "@/settings";
import { EmbedBuilder } from "discord.js";

new Component({
    customId: "register-start-modal",
    type: "Modal", cache: "cached",
    async run(interaction) {
        const { fields } = interaction;
        const nickname = fields.getTextInputValue("register-nickname-input");
        
        interaction.reply({ ephemeral,
            content: `${nickname} saved!`
        });
    },
});
```

You can create the components in the same file as the commands for easy viewing or be able to use variables from the file without having to export them.
```ts
// src/discord/commands/post.ts
import { Command, Component } from "@/discord/base";
import { ApplicationCommandOptionType, ApplicationCommandType, Attachment, AttachmentBuilder, Collection, CommandInteractionOptionResolver, EmbedBuilder, ModalBuilder, TextChannel, TextInputStyle, codeBlock } from "discord.js";
import { createModalInput, createEmbedAuthor, hexToRgb } from "@magicyan/discord";
import { settings } from "@/settings";

const members: Collection<string, Attachment> = new Collection();

new Command({
    name: "post",
    description: "Post command",
    type: ApplicationCommandType.ChatInput,
    dmPermission,
    options: [
        {
            name: "image",
            description: "Image",
            type: ApplicationCommandOptionType.Attachment,
            required,
        }
    ],
    run(interaction) {
        const { member, options } = interaction;

        const image = options.getAttachment("image", true);

        members.set(member.id, image);

        interaction.showModal(new ModalBuilder({
            customId: "post-modal",
            title: "Post",
            components: [
                createModalInput({
                    customId: "post-title-input",
                    label: "Title",
                    style: TextInputStyle.Short,
                    required,
                }),
                createModalInput({
                    customId: "post-description-modal",
                    label: "Description",
                    style: TextInputStyle.Paragraph,
                    required,
                })
            ]
        }));
    }
});

new Component({
    customId: "post-modal", 
    type: "Modal", cache: "cached",
    async run(interaction) {
        const { member, fields, guild, user } = interaction;
        
        const image = members.get(member.id);
        if (!image){
            interaction.reply({ ephemeral,
                content: "Initial image not found! Use /post again"
            });
            return;
        }
        
        const title = fields.getTextInputValue("post-title-input");
        const description = fields.getTextInputValue("post-description-input");

        const channel = guild.channels.cache.get("1086511902173171752") as TextChannel;

        await interaction.deferReply({ ephemeral });

        await channel.send({
            embeds: [
                new EmbedBuilder({
                    title, description, 
                    author: createEmbedAuthor({ user }),
                    color: hexToRgb(settings.colors.theme.success),
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
```

You may have noticed that sometimes a value has not been set for some properties. That's because this base has common global variables to use when dealing with discord.js
```ts
declare global {
    var animated: true; // Frequently used to define an emoji is animated
    var fetchReply: true; // Frequently used in replys
    var ephemeral: true; // Frequently used in replys
    var required: true; // Frequently used in commands options
    var inline: true // Frequently used in embed fields
    var disabled: true // Frequently used in buttons and selects
    var dmPermission: false; // Frequently used in commands
    var components: []; // Frequently used to clear components in a message
    var embeds: []; // Frequently used to clear embeds in a message
    var __rootname: string; // Current work directory path (cwd)
}
```
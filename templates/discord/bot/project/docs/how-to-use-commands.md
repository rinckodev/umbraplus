To create a new command, import the Command class from the `src/discord/base` folder. All commands must be created in the `src/discord/commands` folder or subfolders of the commands folder

You can create slash **commands**, **user** and **message** context menus

The run method interaction typing is defined according to the command type

```ts
import { ApplicationCommandType } from "discord.js";
import { Command } from "@/discord/base";

new Command({
    name: "ping",
    description: "Ping command",
    dmPermission: false,
    type: ApplicationCommandType.ChatInput,
    async run(interaction){ // ChatInputCommandInteraction

        interaction.reply({ content: "pong" });
    }
});
```

Equivalent code with pure discord.js
```ts
client.on("ready", async (readyClient) => {
    readyClient.application.commands.set([
        {
            name: "ping",
            description: "Ping command",
            dmPermission: false,
            type: ApplicationCommandType.ChatInput,
        }
    ]);
});

client.on("interactionCreate", async (interaction) => {
    if (interaction.isChatInputCommand()){
        switch(interaction.commandName){
            case "ping":{
                interaction.reply({ content: "pong" });
                return;
            }
        }
    }
});
```

```ts
new Command({
    name: "Profile",
    dmPermission: false,
    type: ApplicationCommandType.User, // <= User context menu command type
    async run(interaction){ // UserContextMenuCommandInteraction
        const { targetUser } = interaction;

        interaction.reply({ content: `${targetUser.displayName}'s profile ` });
    }
});
```

```ts
new Command({
    name: "Reply",
    dmPermission: false,
    type: ApplicationCommandType.Message, // <= Message context menu command type
    async run(interaction){ // MessageContextMenuCommandInteraction
        const { targetMessage } = interaction;

        await interaction.deferReply({ ephemeral });
    
        targetMessage.reply({ content: `Hello ${targetMessage.author}!` });
    }
});
```
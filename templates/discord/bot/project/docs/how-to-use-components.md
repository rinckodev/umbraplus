About components, the Component class will be used to create the functionality of a fixed component

Import the class from the `src/discord/base` folder, then set the custom id and component type
The components that can be defined in the type property are buttons and any type of select menu

```ts
import { Component } from "@/discord/base";
import { ComponentType } from "discord.js";

new Component({
    customId: "example-component-button",
    type: ComponentType.Button, cache: "cached",
    async run(interaction) {
        interaction.reply({ ephemeral, content: "This is a button component!" });
    },
});
```

```ts
// Commnad code block ===
const channel = interaction.channel as TextChannel;

const embed = new EmbedBuilder({ description: "Welcome to the store" });
const row = createRow(new StringSelectMenuBuilder({
    customId: "store-products-select",
    placeholder: "Select the product",
    options: [
        { label: "Apple", value: "apple", emoji: "🍎" },
        { label: "Melon", value: "melon", emoji: "🍉" },
        { label: "Banana", value: "banana", emoji: "🍌" }
    ]
}));

channel.send({ embeds: [embed], components: [row] });
// ===

new Component({
    customId: "store-products-select",
    type: ComponentType.StringSelect, cache: "cached",
    async run(interaction) {
        const { values:[selected] } = interaction;

        interaction.reply({ ephemeral, content: `You select ${selected}` });
    },
});
```

It is possible to reply multiple components passing a function instead of a string in the customId property
```ts
// User context menu command
new Command({
    name: "Manage user",
    dmPermission,
    type: ApplicationCommandType.User,
    async run(interaction){
        const { targetUser } = interaction;

        const embed = new EmbedBuilder({ description: `Manage ${targetUser}` });
        const row = createRow(
            new ButtonBuilder({ customId: "manage-user-kick", label: "Kick", style: ButtonStyle.Secondary }),
            new ButtonBuilder({ customId: "manage-user-ban", label: "Ban", style: ButtonStyle.Danger }),
            new ButtonBuilder({ customId: "manage-user-timeout", label: "Timeout", style: ButtonStyle.Danger }),
            new ButtonBuilder({ customId: "manage-user-alert", label: "Alert", style: ButtonStyle.Primary })
        );

        interaction.reply({ ephemeral, embeds: [embed], components: [row] });
    }
});
// ===

new Component({
    name: "Manage user buttons",
    customId: id => id.startsWith("manage-user-"),
    type: ComponentType.Button, cache: "cached",
    async run(interaction) {
        const { customId, message, guild } = interaction;
        const action = customId.replace("manage-user-", "");
        const targetMember = await guild.members.fetch(message.embeds[0].footer?.text!);

        switch(action){
            case "kick": {
                targetMember.kick();
                // do things ...
                break;
            }
            case "ban": {
                targetMember.ban();
                // do things ...
                break;
            }
            case "timeout": {
                targetMember.timeout(60000);
                // do things ...
                break;
            }
            case "alert": {
                targetMember.send({ /* ... */ });
                // do things ...
                break;
            }
        }
    },
});
```

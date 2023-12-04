You can create functionality for modals in the same way as [components](./how-to-use-components.md);

```ts
import { Modal } from "@/discord/base";

new Modal({
    customId: "announcement-modal",
    cache: "cached",
    run(interaction) {
        const { fields } = interaction;
        const title = fields.getTextInputValue("title-input");

        interaction.reply({ content: title });
    },
});
```

If the modal is opened through a message component, you can set the **ModalMessageModalSubmitInteraction** typing by setting true in the **isFromMessage** property

```ts
new Modal({
    customId: "announcement-modal",
    cache: "cached",
    isFromMessage: true, // Modal opened from button or select menu
    run(interaction) { // ModalMessageModalSubmitInteraction
        const { fields } = interaction;
        const title = fields.getTextInputValue("title-input");

        interaction.update({ content: title, components: [] }); // Update method avaliable
    },
});
```
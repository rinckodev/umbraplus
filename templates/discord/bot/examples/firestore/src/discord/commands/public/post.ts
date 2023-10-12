import { db } from "@/database";
import { Command, Component } from "@/discord/base";
import { settings } from "@/settings";
import { createModalInput, hexToRgb } from "@magicyan/discord";
import { ApplicationCommandType, EmbedBuilder, ModalBuilder, TextInputStyle, codeBlock } from "discord.js";

new Command({
    name: "post",
    description: "Post command",
    type: ApplicationCommandType.ChatInput,
    dmPermission,
    async run(interaction) {
        const { user } = interaction;

        const userData = await db.get(db.users, user.id);
        if (!userData){
            interaction.reply({ ephemeral, content: "Not registered! Use /register" });
            return;
        }

        interaction.showModal(new ModalBuilder({
            customId: "post-modal",
            title: "Post",
            components: [
                createModalInput({
                    customId: "post-title-input",
                    label: "Title",
                    style: TextInputStyle.Short,
                    required: true
                }),
                createModalInput({
                    customId: "post-description-input",
                    label: "Description",
                    style: TextInputStyle.Paragraph,
                    required: true
                }),
                createModalInput({
                    customId: "post-tags-input",
                    label: "Tags",
                    maxLength: 120,
                    placeholder: "Separate tags using commas \",\"",
                    style: TextInputStyle.Paragraph,
                    required: false
                })
            ]
        }));
    }
});

new Component({
    customId: "post-modal", type: "Modal", cache: "cached",
    async run(interaction) {
        const { user, fields, channel } = interaction;
        const userData = await db.get(db.users, user.id);
        if (!userData){
            interaction.reply({ ephemeral, content: "Not registered! Use /register" });
            return;
        }
        
        const title = fields.getTextInputValue("post-title-input");
        const description = fields.getTextInputValue("post-description-input");
        const rawTags = fields.getTextInputValue("post-tags-input");

        const tags = rawTags.trim().split(",");

        await interaction.deferReply({ ephemeral });

        await channel?.send({
            embeds: [
                new EmbedBuilder({
                    title, description, timestamp: new Date(),
                    color: hexToRgb(settings.colors.theme.success),
                    fields: tags.length > 1 ? [
                        { name: "Tags", value: tags.map(tag => `${tag}`).join(" ") }
                    ] : []
                })
            ]
        })
        .then(message => {
            interaction.editReply({content: `New post ${message.url}`});

            const posts = userData.posts || [];

            posts.push({
                title, description, tags: tags.length > 1 ? tags : [],
                createdAt: new Date(),
            });

            db.update(db.usersKeys, user.id, [
                db.field("posts", posts)
            ]);
        })
        .catch(err => {
            interaction.editReply({content: `Error: ${codeBlock(err)}`});
        });
    }, 
});
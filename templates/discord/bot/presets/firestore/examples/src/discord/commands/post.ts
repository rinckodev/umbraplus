import { Command, Component } from "@/discord/base";
import { ActionRowBuilder, ApplicationCommandOptionType, ApplicationCommandType, Attachment, AttachmentBuilder, Collection, EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, codeBlock } from "discord.js";

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
                        customId: "post-description-input",
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
            customId: "post-modal", type: "Modal", cache: "cached",
            async run(interaction) {
                const { member, fields, channel } = interaction;
                
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

                await interaction.deferReply({ephemeral: true});

                await channel?.send({
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
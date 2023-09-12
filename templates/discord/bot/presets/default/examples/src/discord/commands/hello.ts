import { Command, Component } from "@discord/base";
import { ApplicationCommandType, EmbedBuilder, StringSelectMenuBuilder, codeBlock } from "discord.js";
import { createRow, hexToRgb, brBuilder } from "@magicyan/discord";
import { settings } from "@/settings";

new Command({
    name: "hello",
    description: "Select language",
    dmPermission,
    type: ApplicationCommandType.ChatInput,
    async run(interaction){

        interaction.reply({ ephemeral, 
            embeds: [
                new EmbedBuilder({ 
                    description: "Select the programming language", 
                    color: hexToRgb(settings.colors.theme.primary) 
                })
            ],
            components: [
                createRow(
                    new StringSelectMenuBuilder({
                        customId: "hello-language-select",
                        placeholder: "Select the language",
                        options: [
                            { label: "Typescript", value: "ts" },
                            { label: "Javascript", value: "js" },
                            { label: "Java", value: "java" },
                            { label: "Python", value: "py" },
                            { label: "C#", value: "cs" },
                            { label: "C++", value: "cpp" },
                            { label: "GO", value: "go" },
                            { label: "Rust", value: "rs" },
                            { label: "Lua", value: "lua" },
                            { label: "Ruby", value: "rb" },
                            { label: "Julia", value: "jl" },
                            { label: "Php", value: "php" },
                        ]
                    })
                )
            ]
        });
    }
});

new Component({
    customId: "hello-language-select", type: "StringSelect", cache: "cached",
    async run(interaction) {
        const { values: [selected] } = interaction;
        const helloLanguages = {
            ts: "console.log(\"Hello, World!\");",
            js: "console.log(\"Hello, World!\");",
            py: "print(\"Hello, World!\")",
            lua: "print(\"Hello, World!\")",
            rb: "puts \"Hello, World!\"",
            jl: "println(\"Hello, World!\")",
            java: brBuilder(
                "public class HelloWorld {",
                "   public static void main(String[] args) {",
                "        System.out.println(\"Hello, World!\");",
                "    }",
                "}"
            ),
            cs: brBuilder(
                "using System;",
                "",
                "class Program {",
                "   static void Main(string[] args) {",        
                "       Console.WriteLine(\"Hello, World!\");",
                "   }",
                "}",
            ),
            cpp: brBuilder(
                "#include <iostream>",
                "",
                "int main() {",
                "   std::cout << \"Hello, World!\" << std::endl;",
                "   return 0;",
                "}"
            ),
            go: brBuilder(
                "package main",
                "",
                "import \"fmt\"",
                "",
                "func main() {",
                "   fmt.Println(\"Hello, World!\")", 
                "}"
            ),
            rs: brBuilder(
                "fn main() {", 
                "   println!(\"Hello, World!\");",
                "}"
            ),
            php: brBuilder(
                "<?php",
                "echo \"Hello, World!\";", 
                "?>"
            ),
        };

        interaction.update({
            embeds: [new EmbedBuilder({
                color: hexToRgb(settings.colors.theme.success),
                description: codeBlock(selected, helloLanguages[selected as keyof typeof helloLanguages])
            })]
        });
    },
})
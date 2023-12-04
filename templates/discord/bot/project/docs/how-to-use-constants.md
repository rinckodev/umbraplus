There are global constants variables that you can use in method or function options objects, also using the "shorthand".

These are variables with the same name as very common properties when we are creating commands and systems for our discord bot. And when we use these properties that are normally optional, we define a default value for them

For example the ephemeral property. This property is often used when we want to make the message private only for the user of the interaction, however, all interaction responses are not ephemeral by default, so most of the time we define the response as ephemeral, this property will be true. On this base we have it as a global variable and we can use it as a "shorthande" in the reply method options object

```ts
interaction.deferReply({ ephemeral }); // ephemeral is true by default;
```

```ts
// src/settings/constants/index.ts
global.ephemeral = true; // Interaction reply/followUp property

// src/settings/@types/constants.d.ts
export declare global {
    var ephemeral: true;
}
```
This way, it is not necessary to import these variables because they are global.

See the constants files in the `src/settings` folder to find out all the constant global variables
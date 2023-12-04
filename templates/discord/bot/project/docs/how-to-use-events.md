To create a listener for a discord.js event, use the Event class from the `src/discord/base` folder

```ts
import { Event } from "@discord/base";

new Event({
    name: "messageUpdate",
    run(oldMessage, newMessage) {
        console.log("Message edited at:", newMessage.editedAt?.toDateString());
        console.log("Author", newMessage.author?.displayName);
        console.log("Old message content: ", oldMessage.content);
        console.log("New message content:", newMessage.content);   
    }
});
```

All discord events are typed in the name property, when choosing an event, the run function will also be typed with the arguments that the chosen event should receive

Equivalent code with pure discord.js
```ts
client.on("messageUpdate", (oldMessage, newMessage) => {
    // ...
})
```
# Basic Usage

## async/await

Since quick.db’s methods are asynchronous, the surrounding function where quick.db is being used has to be async.

```ts
async function myMethod() {
  // your code goes here...
}
```

In this project it will be common to use quick db in commands

```ts
import { Command } from "@/discord/base";
import { ApplicationCommandType } from "discord.js";

new Command({
    name: "database",
    description: "Database command",
    dmPermission: false,
    defaultMemberPermissions: ["Administrator"],
    type: ApplicationCommandType.ChatInput,
    async run(interaction){
        // your code goes here...
    }
});
```

## Set & Get

Quick.db has a multitude of methods that you can find on the API page. The two most commonly used ones are get and set.

```ts
// Setting the string "myValue" to the key "myKey"
await db.set("myKey", "myValue"); // Returns -> "myValue"

// Getting the value of the key "myKey"
await db.get("myKey"); // Returns -> "myValue"

// In addition to strings, you can store objects as well.
await db.set("myUser", { balance: 500 }); // Returns -> { balance: 500 }

// Getting the value of the key "myUser"
await db.get("myUser"); // Returns -> { balance: 500 }
```

## Delete

How to delete keys you have previously created.

```ts
// Deleting the key "myKey"
await db.delete("myKey"); // Returns -> "myValue"
```

## Dot Notation

You can use dot notation in the key parameter to modify the associated object’s properties. Notice below how “myUser” is the key, although the property “balance” is being set and get.

```ts
await db.set("myUser.balance", 700); // Returns -> { balance: 700 }
await db.get("myUser.balance"); // Returns -> 700
```

## Arrays

In addition to primitive types and objects, quick.db can also store arrays in the database.

```ts
await db.set("myArray", [1, 2, 3]); // Returns -> [1, 2, 3]
await db.get("myArray"); // Returns -> [1, 2, 3]

// Using the myUser object from earlier
await db.set("myUser.items", ["Sword", "Shield", "Health Potion"]); // Returns -> { balance: 700, items: [ 'Sword', 'Shield', 'Health Potion' ] }

// Some additional helper methods for arrays include push, pull, and has
await db.push("myUser.items", "Armor"); // Returns -> { balance: 700, items: [ 'Sword', 'Shield', 'Health Potion', 'Armor' ] }
await db.pull("myUser.items", "Health Potion"); // Returns -> { balance: 700, items: [ 'Sword', 'Shield', 'Armor' ] }
```

## Add & Subtract

There are some helper methods for adding and subtracting values as well.

```ts
await db.add("myUser.balance", 100); // Returns -> { balance: 800, items: [ 'Sword', 'Shield', 'Armor' ] } }
await db.sub("myUser.balance", 50); // Returns -> { balance: 750, items: [ 'Sword', 'Shield', 'Armor' ] } }
```
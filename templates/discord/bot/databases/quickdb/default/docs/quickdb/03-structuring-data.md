# Structuring data

Use typescript to create data interfaces

```ts
export interface UserData {
    wallet?: {
        gems?: number;
        coins?: number
    }
    level?: number;
    xp?: number;
}
```

Organize data to make it simple to use

```ts
// src/database/index.ts
import { QuickDB } from "quick.db";
import { UserData } from "./interfaces/UserData";

const filePath = rootTo("localdb.sqlite"); 
// Path to the localdb.sqlite file from the project root

const db = {
    // Passing the interface as a generic type to the class
    users: new QuickDB<UserData>({ filePath, table: "users" })
};

export * from "./interfaces/UserData";
export { db };
```

Use IDs as a key for data

```ts
import { db } from "@/database";

import { Command } from "@/discord/base";
import { ApplicationCommandType } from "discord.js";

new Command({
    name: "wallet",
    description: "View your wallet",
    dmPermission: false,
    defaultMemberPermissions: ["Administrator"],
    type: ApplicationCommandType.ChatInput,
    async run(interaction){
        const { user } = interaction;
        
        const userData = await db.users.get(user.id);

        interaction.reply({ ephemeral, 
            content: `Your ballance: ${userData?.wallet?.coins ?? 0} coins` 
        })

        // or
        
        const userCoins = await db.users.get<number>(user.id + ".wallet.coins");

        interaction.reply({ ephemeral, 
            content: `Your ballance: ${userCoins ?? 0} coins`
        })
    }
});
```

Create functions to facilitate repetitive processes

Example: Let's imagine that you are creating a bot where it is required all users to have registration data

```ts
// src/database/functions/users.ts
import { db } from "@/database";

export async function getRegister(id: string): Promise<UserData> {
    const initialData: UserData = { 
        wallet: { coins: 10 }, 
        level: 1, xp: 0
    };
    return await db.users.get(id) || await db.users.set(id, initialData);
}
```
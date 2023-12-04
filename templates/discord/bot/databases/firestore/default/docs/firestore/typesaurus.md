# Guide

- [English](#how-to-use-typesaurus)
- [Português](#como-usar-o-typesaurus)

### <img src="../assets/icons/flag_us.svg" alt="flag us" width="20" height="auto" style="vertical-align: bottom;"> English
# How to use Typesaurus

You can read the complete documentation for Typesaurus on the website https://typesaurus.com/.

In this bot base, there is only a slight change to provide some convenience.

The "database" folder inside the "src" directory exports an object named "db," which contains all the functions of Typesaurus and its Firestore collections ("You should set").

```ts
const db = {
    users: typesaurs.collection<UserDocument>("userscollection"),
    usersKeys: typesaurs.collection<Required<UserDocument>>("userscollection"),
    /**
     *  yourCollectionName: typesaurs.collection<YourCollectionDocument>("yourCollectionName"),
     *  examples: 
     *  guilds: typesaurs.collection<GuildDocument>("guilds"),
     *  logs: typesaurs.collection<LogDocument>("logs"),
     */
    ...typesaurs,
    async get<Model>(collection: typesaurs.Collection<Model>, id: string){
        return (await typesaurs.get<Model>(collection, id))?.data;
    },
    getFull: typesaurs.get
};
```

The `get` function will return only an object containing the data of the document. Unlike the default get function of Typesaurus, which returns other information, if you want to use it, call `getFull`.

By defining the collections directly in the "db" object, you won't need to import the interfaces all the time. See an example below:

```ts
async run(interaction){
    const { user } = interaction;

    const userData = await db.get(db.users, user.id);

    interaction.reply({ content: `Coins: ${userData?.wallet?.coins || 0}` })
}
```

<p><small> <a href="#guide">Home</a> </small></p>

### <img src="../assets/icons/flag_br.svg" alt="flag br" width="20" height="auto" style="vertical-align: bottom;"> Português
## Como usar o typesaurus

Você pode ler a documentação completa do typesaurus no site https://typesaurus.com/

Nessa base de bot só existe uma pequena mudança para proporcionar um pouco de praticidade

A pasta database dentro de src, exporta um objeto chamado "db", nele contém todas as funções do typesaurus e suas collections do firestore ("Você deve definir").

```ts
const db = {
    users: typesaurs.collection<UserDocument>("userscollection"),
    usersKeys: typesaurs.collection<Required<UserDocument>>("userscollection"),
    /**
     *  yourCollectionName: typesaurs.collection<YourCollectionDocument>("yourCollectionName"),
     *  examples: 
     *  guilds: typesaurs.collection<GuildDocument>("guilds"),
     *  logs: typesaurs.collection<LogDocument>("logs"),
     */
    ...typesaurs,
    async get<Model>(collection: typesaurs.Collection<Model>, id: string){
        return (await typesaurs.get<Model>(collection, id))?.data;
    },
    getFull: typesaurs.get
};
```

A função `get` vai retornar apenas um objeto contendo os dados do documento. Diferente da função get padrão do typesaurus que retorna outras informações, caso queira utilizà-la, chame `getFull`

Você definindo as coleções diretamente no objeto db, você não precisará importar as interfaces o tempo todo. Veja um exemplo abaixo
```ts
async run(interaction){
    const { user } = interaction;

    const userData = await db.get(db.users, user.id);

    interaction.reply({ content: `Coins: ${userData?.wallet?.coins || 0}` })
}
```

<p><small> <a href="#guide">Início</a> </small></p>
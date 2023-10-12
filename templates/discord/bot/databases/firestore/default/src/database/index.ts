import { firebaseAccount } from "@/settings";
import firebase, { credential } from "firebase-admin";
import * as typesaurs from "typesaurus";

import { UserDocument } from "./documents/UserDocument";

firebase.initializeApp({ credential: credential.cert(firebaseAccount)});

const db = {
    users: typesaurs.collection<UserDocument>("users"),
    usersKeys: typesaurs.collection<Required<UserDocument>>("users"),
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

export { db };

export * from "./documents/UserDocument";
/**
 * Export all Document Interfaces
 * 
 * export * from "./documents/otherDocuments";
 * export * from "./documents/otherDocuments";
 */
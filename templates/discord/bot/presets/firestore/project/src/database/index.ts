import { firebaseAccount } from "@/settings";
import firebase, { credential } from "firebase-admin";
import typesaurs from "typesaurus";

import { UserDocument } from "./documents/UserDocument";

firebase.initializeApp({ credential: credential.cert(firebaseAccount)});

const db = {
    users: typesaurs.collection<UserDocument>("tempusers"),
    /**
     *  yourCollectionName: typesaurs.collection<YourCollectionDocument>("yourCollectionName"),
     *  examples: 
     *  guilds: typesaurs.collection<GuildDocument>("guilds"),
     *  logs: typesaurs.collection<LogDocument>("logs"),
     */
    ...typesaurs
};

export { db };

export * from "./documents/UserDocument";
/**
 * Export all Document Interfaces
 * 
 * export * from "./documents/otherDocuments";
 * export * from "./documents/otherDocuments";
 */
interface UserPostSchema {
    title: string;
    description: string;
    createdAt: Date;
    tags: string[]
}

interface UserDocumentSchema {
    username: string;
    displayName?: string;
    wallet?: {
        coins: number;
        credits: number;
    }
    posts?: UserPostSchema[]
}

export type UserDocument = UserDocumentSchema
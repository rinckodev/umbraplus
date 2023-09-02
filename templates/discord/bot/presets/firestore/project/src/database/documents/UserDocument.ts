interface UserPostSchema {
    title: string,
    description: string,
    createdAt: Date,
    tags: string[]
}

interface UserDocumentSchema {
    username: string,
    displayName: string,
    posts: UserPostSchema[]
}

export type UserDocument = Partial<UserDocumentSchema>
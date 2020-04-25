export interface Answer {
    postId: string;
    parentId: string;
    commentId: string;

    user: User;

    title: string;
    text: string;
    answers: Answer[];

    votes: number;

    likes: number;
    dislikes: number;
    happy: number;
    angry: number;
    surprise: number;
    sad: number;

    parentData: object;
    level: number;
}

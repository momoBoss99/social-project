export class Post {
    constructor(public idPost: number,
                public urlImg: string, 
                public descrizione: string,
                public dataPost: Date,
                public likes: number,
                public comments: Comment[],
                public idProfile: number){}
}
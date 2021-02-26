export class Commento {
    constructor(public comment: string, 
        public likes: number,
        public dataScrittura: Date,
        public idProfilo: number,
        public idCommento: number,
        public idPost: number,
        public idCommentatore: number){}
}
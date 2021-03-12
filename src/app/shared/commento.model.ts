export class Commento {
    constructor(
        public idCommento: string,
        public comment: string, 
        public dataScrittura: Date,
        public idProfilo: string,
        public idPost: string,
        public idCommentatore: string){}
}
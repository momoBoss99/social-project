export class CommentoLike {
    constructor(
        /**
         * chiave composta per identificare
         * il post
         */
        public idPost: string,
        public idCommentatore: string,
        public idProfilo: string,
        /**
         * id utente che mette like 
         * al post
         */
        public idLiker: string,
        /**
         * data del like
         */
        public data: Date
    ){}
}
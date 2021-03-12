export class CommentoLike {
    constructor(
        /**
         * chiave composta per identificare
         * il post
         */
        public idCommentLike: string,
        public idCommento: string,
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
import { Component, Input, OnInit } from "@angular/core";
import { Commento } from "src/app/shared/commento.model";
import { Like } from "src/app/shared/like.model";
import { Post } from "src/app/shared/post.model";
import { Profile } from "src/app/shared/profile.model";
import { AccountsService } from "../accounts.service";

@Component({
    selector: 'app-post-card',
    templateUrl: './post-card.component.html',
    styleUrls: ['./post-card.component.scss']
})
export class PostCardComponent implements OnInit {
    @Input('profilo') profilo: Profile;
    @Input('post') post: Post;
    /**
     * variabili che servono ad aggiungere un commento
     * oppure ad aggiungere un like
     */

    /**
     * l'idea è quella di utilizzare due vettori paralleli
     * uno di commenti e l'altro di profili.
     * Nel post si farà uno scorrimento parallelo (usando l'indice)
     * per associare il nome del commentatore al commento del commentatore
     */
    commenti: Commento[] = [];
    profiliCommentatori: Profile[] = [];
    likesAlPost: Like[] = [];
    loadingComment: boolean = false;
    loadingLikes: boolean = false;
    /**
     * variabile modificata dinamicamente dall'input nel component HTML
     */
    commento: string;
    commentoInviato: boolean = false;

    constructor(private profilesService: AccountsService){}

    ngOnInit(){
        this.loadingComment = false;
        this.getAndFiltraCommenti();
        this.getAndFiltraLikes();
    }
    
    /**
     * aggiunta di un commento
     */
    onSubmit(){
        this.commentoInviato = true;
        this.loadingComment = false;
        let idNuovoCommento: number;
        let idCommentatore: string = JSON.parse(localStorage.getItem("sessione")).id;

        if(this.commenti){
            console.log('è definito');
        }
        else {
            console.log('non è definito')
            idNuovoCommento = 0;
        }

        this.profilesService.createComment(new Commento(this.commento, new Date(Date.now()), this.profilo.id, this.post.idPost, idCommentatore)).subscribe(
            responseData => {
                console.log(responseData);
                /**
                 * aggiornamento dinamico dei commenti
                 */
                this.getAndFiltraCommenti();
            }
        , error => {
            console.log(error);
        });
        
    }
    /**
     * metodo privato che effettua una get di tutti i commenti 
     * e fa un filtraggio per ottenere solo i commenti relativi al post
     */
    private getAndFiltraCommenti(){
        this.commenti = this.profilesService.fetchComments(this.post.idPost);
        /**
         * ho bisogno di un vettore parallelo di profili di commentatori 
         * al vettore di commenti
         */
        /*
        for(let commento of this.commenti){
            this.profiliCommentatori
                    .push(this.profilesService.fetchAccount(commento.idCommentatore));
        }
        */
    }
    /**
     * metodo privato che mi permette di prendere tutti i like e poi
     * filtrare prendendo solo quelli relativi a questo post
     */
    private getAndFiltraLikes(){
        this.loadingLikes = false;
        this.profilesService.getLikes().subscribe(
            likesResponse => {
                this.likesAlPost = [];
                /**
                 * operazione di filtraggio dei likes
                 */
                for(let like of likesResponse){
                    if(like.idPost === this.post.idPost){
                        this.likesAlPost.push(like);
                    }
                }
                this.loadingLikes = true;
            }
        );
    }
    /**
     * se c'è già il like, viene aggiunto, altrimenti viene tolto
     */
    onToggleLike(){
        console.log('like toggled');
        console.log(this.likeCheck());
        let idSession = JSON.parse(localStorage.getItem("sessione")).id;
        /**
         * se il like era già presente, lo rimuovo
         */
        if(this.likeCheck()){
            console.log('rimozione like');
            this.profilesService.removeLike(this.post.idPost, idSession).subscribe(response => {
                console.log(response);
            })
        }
        /**
         * altrimenti, aggiungo il like
         */
        else{
            console.log('aggiunta like');
            this.profilesService.addLike(new Like(new Date(Date.now()), this.post.idPost.toString(), idSession)).subscribe(
                responseData => {
                    console.log(responseData);
                }
            );
        }
    }

    /**
     * metodo che verifica se il like a questo preciso post da parte
     * della persona loggata in questione è presente o meno
     */
    async likeCheck(): Promise<boolean>{
        let response: boolean = false;
        this.profilesService.getLikes().subscribe(
            responseLikes => {
                /**
                 * nessuno ha mai messo dei likes!
                 */
                if (responseLikes.length === 0) {
                    return false;
                }
                for (let like of responseLikes) {
                    if (like.idPost === this.post.idPost) {
                        let idSession = JSON.parse(localStorage.getItem("sessione")).id;
                        if (parseInt(like.idProfileLiker) === idSession) {
                            /**
                             * tutti i check sono okay, il like c'è già
                             */
                            console.log('like cera');
                            response = true;
                            return true;
                        }
                    }
                }
                response = false;
                return false;
            }
        )
        return response;
    }
}   
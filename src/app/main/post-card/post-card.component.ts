import { Component, Input, OnInit } from "@angular/core";
import { Commento } from "src/app/shared/commento.model";
import { Like } from "src/app/shared/like.model";
import { Post } from "src/app/shared/post.model";
import { Profile } from "src/app/shared/profile.model";
import ProfilesService from "../profiles.service";

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

    commento: string;
    commentoInviato: boolean = false;

    constructor(private profilesService: ProfilesService){}

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
        if(this.commenti){
            console.log('è definito');
        }
        else {
            console.log('non è definito')
            idNuovoCommento = 0;
        }
        this.profilesService
                .onAddComment(new Commento(this.commento, 0, new Date(Date.now()), this.profilo.id, this.post.idPost, 1))
                .subscribe(
                    /**
                     * aggiornamento dinamico dei commenti del post dopo averne scritto uno nuovo
                     */
                    (response) => {this.getAndFiltraCommenti();}
                );
        
    }
    /**
     * metodo privato che effettua una get di tutti i commenti 
     * e fa un filtraggio per ottenere solo i commenti relativi al post
     */
    private getAndFiltraCommenti(){
        this.profilesService.getComments().subscribe(
            responseComments => {
                this.commenti = [];
                console.log(responseComments);
                /**
                 * operazione di filtraggio per ottenere solo
                 * i commenti che voglio io
                 */
                for(let response of responseComments){
                    if(response === null){
                        continue;
                    }
                    if(response.idPost === this.post.idPost){
                        this.commenti.push(response);
                        this.profilesService.fetchAccount(response.idCommentatore).subscribe(
                            responseProfile => {
                                this.profiliCommentatori.push(responseProfile);
                            }
                        )
                    }
                }
                this.loadingComment = true;
                console.log(this.commenti);
            }
        )
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
                    if(like.idPost === this.post.idPost.toString()){
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
                    if (parseInt(like.idPost) === this.post.idPost) {
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
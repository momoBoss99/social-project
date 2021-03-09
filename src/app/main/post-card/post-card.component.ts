import { HttpClient } from "@angular/common/http";
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
    isLiked: boolean = false;
    /**
     * variabile modificata dinamicamente dall'input nel component HTML
     */
    commento: string;
    commentoInviato: boolean = false;

    constructor(private profilesService: AccountsService, private http: HttpClient){}

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
        let idCommentatore: string = JSON.parse(localStorage.getItem("sessione")).id.toString();


        this.profilesService.createComment(new Commento(this.commento, new Date(Date.now()), this.profilo.id, this.post.idPost, idCommentatore)).subscribe(
            responseData => {
                console.log(responseData);
                /**
                 * aggiornamento dinamico dei commenti
                 */
                this.commento = "";
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
        this.profilesService.fetchComments().subscribe(
            responseComments => {
                for(let comment of responseComments){
                    if(comment.idPost === this.post.idPost){
                        this.commenti.push(comment);
                        this.getAccount(comment.idCommentatore);
                    }
                }
                this.loadingComment = true;
            }
        );
        
    }

    private getAccount(idCommentatore: string){
        this.profilesService.fetchAccounts().subscribe(
            responseProfiles => {
                for(let profile of responseProfiles){
                    if(profile.id === idCommentatore){
                        this.profiliCommentatori.push(profile);
                        break;
                    }
                }
            }
        );
    }
    /**
     * metodo privato che mi permette di prendere tutti i like e poi
     * filtrare prendendo solo quelli relativi a questo post, e inoltre setta il valore 
     * di isLiked
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
                        if(like.idProfileLiker === this.profilo.id){
                            this.isLiked = true;
                        }
                    }
                }
                this.loadingLikes = true;
            }
        );
    }

    onToggleLikeTest(){
        let isPresent: boolean = false;
        let idSession: string = JSON.parse(localStorage.getItem("sessione")).id.toString();
        /**
         * step 1: like check
         */
        this.profilesService.getLikes().subscribe(
            responseLikes => {
                for(let like of responseLikes){
                    if(like.idPost === this.post.idPost){
                        if(like.idProfileLiker === idSession){
                            /**
                             * like presente => rimozione like
                             */
                            isPresent = true;
                            this.isLiked = false;
                            break;
                        }
                    }
                }
                isPresent ? 
                /**
                 * logica necessaria a cancellare il like e ristampare
                 * tutti i likes
                 */
                this.profilesService.removeLike(this.post.idPost, idSession).subscribe(responseLikes => {
                    const likeArray: Like[] = [];
                    for(const key in responseLikes){
                        if(responseLikes.hasOwnProperty(key)){
                            likeArray.push({...responseLikes[key]});
                            if(responseLikes[key].idPost === this.post.idPost){
                                if(responseLikes[key].idProfileLiker  === idSession){
                                    console.log("like trovato");
                                    this.http.delete<Like>(
                                        `https://insta-clone-7660e-default-rtdb.firebaseio.com/likes/${key}.json`
                                    ).subscribe(response => {
                                        this.getAndFiltraLikes();
                                    });
                                    break;
                                }
                            }
                        }
                    }
                    return likeArray;
                }) : 
                this.profilesService.addLike(new Like(new Date(Date.now()), this.post.idPost.toString(), idSession)).subscribe(response => {
                    this.isLiked = true;
                    this.getAndFiltraLikes()
                });
            }
        );
    }
}   
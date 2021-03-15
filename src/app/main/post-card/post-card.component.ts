import { HttpClient } from "@angular/common/http";
import { Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { CommentoLike } from "src/app/shared/commento-like.model";
import { Commento } from "src/app/shared/commento.model";
import { Like } from "src/app/shared/like.model";
import { Post } from "src/app/shared/post.model";
import { Profile } from "src/app/shared/profile.model";
import { AccountsService } from "../accounts.service";
import { UUID } from 'angular2-uuid';


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
    likesPerOgniCommento: number[] = [];
    likesAlPost: Like[] = [];
    loadingComment: boolean = false;
    loadingLikes: boolean = false;
    isLiked: boolean = false;
    isCommentsLikesLoaded: boolean = false;
    idSession: string = JSON.parse(localStorage.getItem('sessione')).id.toString();
    /**
     * variabile modificata dinamicamente dall'input nel component HTML
     */
    commento: string;
    commentoInviato: boolean = false;
    /**
     * variabili dedicate al dropdown sul post
     */
    isDropdown: boolean = false;

    constructor(private profilesService: AccountsService, private http: HttpClient, private router: Router){}

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
        let idCommento: string = UUID.UUID();

        this.profilesService.createComment(new Commento(idCommento ,this.commento, new Date(Date.now()), this.profilo.id, this.post.idPost, idCommentatore)).subscribe(
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
                this.commenti = [];
                this.likesPerOgniCommento = [];
                this.isCommentsLikesLoaded = false;
                for(let comment of responseComments){
                    if(comment.idPost === this.post.idPost){
                        this.commenti.push(comment);
                        this.getAccount(comment.idCommentatore);
                        this.getLikesPerCommento(comment);
                    }
                }
                console.log(this.commenti);
                console.log(this.likesPerOgniCommento);
                this.loadingComment = true;
                this.isCommentsLikesLoaded = true;
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
                console.log(this.profiliCommentatori);
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
                this.isLiked = false;
                /**
                 * operazione di filtraggio dei likes
                 */
                for(let like of likesResponse){
                    if(like.idPost === this.post.idPost){
                        this.likesAlPost.push(like);
                        if(like.idProfileLiker === this.idSession){
                            console.log('cuoricino pieno');
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
                            console.log('like presente dal principio');
                            isPresent = true;
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
                                        console.log("rimozione like");
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
                    console.log("aggiunta like");
                    this.getAndFiltraLikes();
                });
            }
        );
    }


    viewLikesList(){
        this.router.navigate(['/profiles/list/likes', this.post.idPost]);
    }


    /**
     * se il commento aveva già il like di questo utente, viene tolto. 
     * Altrimenti viene aggiunto
     */
    onToggleLikeComment(commento: Commento, index: number){
        this.isCommentsLikesLoaded = false;
        let idSession: string = JSON.parse(localStorage.getItem("sessione")).id.toString();
        /**
         * variabile booleana che mi serve a capire se il like è presente o meno nel commento
         */
        let isPresent: boolean = false;

        this.profilesService.fetchCommentLikes().subscribe(responseCommentLikes => {
            if(responseCommentLikes){
                for(let commentLike of responseCommentLikes){
                    /**
                     * se questo if è true, allora il commento ha già almeno un like.
                     */
                    if(commento.idCommento === commentLike.idCommento){
                            /**
                             * c'era già il like al commento da questo user! like da eliminare.
                             */
                            if(commentLike.idLiker === idSession){
                                this.profilesService.prepareRemoveCommentLike().subscribe(responseCommentLikes => {
                                    for(const key in responseCommentLikes){
                                        if(responseCommentLikes.hasOwnProperty(key)){
                                            let tmp = {...responseCommentLikes[key]};
                                            if(tmp.idCommentLike === commentLike.idCommentLike){
                                                    this.profilesService.deleteCommentLike(key).subscribe(response => {
                                                        console.log('like rimosso');
                                                        this.likesPerOgniCommento[index] -= 1;
                                                        this.isCommentsLikesLoaded = true;
                                                    });
                                                break;
                                            }
                                        }
                                    }
                                })
                                isPresent = true;
                                break;
                            }
                        }
                }
            }
            /**
             * non c'era ancora il like. aggiungere
             */
            if(!isPresent){
                let newId: string = UUID.UUID();
                this.profilesService.addCommentLike(new CommentoLike(newId ,commento.idCommento, idSession, new Date(Date.now()))).subscribe(response => {
                    console.log(response);
                    this.likesPerOgniCommento[index] += 1;
                    this.isCommentsLikesLoaded = true;
                });
            }   
        })
    }


    private getLikesPerCommento(comment: Commento){
        this.profilesService.fetchCommentLikes().subscribe(responseCommentLikes => {
            let counter: number = 0;
            for(let commentLike of responseCommentLikes){
                if(commentLike.idCommento === comment.idCommento){
                        counter++;
                    }
            }
            this.likesPerOgniCommento.push(counter);
        });
    }

    /**
     * questo metodo serve ad aprire il menù (cancella, modifica) di operazioni sul post
     */
    dropdownToggle(){
        console.log('dropdown works');
        this.isDropdown = !this.isDropdown;
    }

    onRemovePost(){
        console.log("rimozione post...");
        this.profilesService.prepareFetchPost().subscribe(responsePosts => {
            for(const key in responsePosts){
                if(responsePosts.hasOwnProperty(key)){
                    let tmp = {...responsePosts[key]};
                    if(tmp.idPost === this.post.idPost){
                        this.profilesService.removePost(key).subscribe(response => {console.log(response);
                        });
                        break;
                    }
                }
            }
        });
        this.router.navigate(['/profiles', this.idSession]);
    }
}   
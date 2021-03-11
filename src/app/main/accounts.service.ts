import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Profile } from "../shared/profile.model";
import { map} from 'rxjs/operators';
import { Post } from "../shared/post.model";
import { Commento } from "../shared/commento.model";
import { Like } from "../shared/like.model";
import { pipe } from "rxjs";
import { Follow } from "../shared/follow.model";
import { CommentoLike } from "../shared/commento-like.model";


/**
 * service che mi permette di connettermi al DB e fare 
 * operazioni crud con le varie risorse (like, commenti, profili, post)
 */
@Injectable({
    providedIn: 'root'
})
export class AccountsService {
    constructor(private http: HttpClient){}

    /**
     * metodo che mi permette di fare il fetch di tutti i profili.
     * su questo metodo devo ancora effettuare la subscription
     */
    fetchAccounts(){
        return this.http.get<Profile[]>(
            'https://insta-clone-7660e-default-rtdb.firebaseio.com/profiles.json'
        ).pipe(
            map(responseData => {
                let arrayProfiles: Profile[] = [];
                for(const key in responseData){
                    if(responseData.hasOwnProperty(key)){
                        arrayProfiles.push({...responseData[key]});
                    }
                }
                return arrayProfiles;
            })
        )
    }

    /**
     * FIXME
     * @param nameLike 
     */
    fetchAccountsSearch(nameLike: string){
        return this.fetchAccounts();
    }
    /**
     * metodo che mi permette di salvare un nuovo profilo nel DB
     * @param profile 
     */
    createAccount(profile: Profile){
        this.http.post(
            'https://insta-clone-7660e-default-rtdb.firebaseio.com/profiles.json',
            profile
        ).subscribe(responseData => {
            console.log(responseData);
        }, error => {
            console.log(error);
        })
    }
    /**
     * metodo che prepara la get di tutti i profili del db
     * @returns 
     */
    prepareUpdateAccount(){
        return this.http.get<Profile[]>(
            'https://insta-clone-7660e-default-rtdb.firebaseio.com/profiles.json'
        );
    }
    /**
     * metodo che prepara la chiamata http di tipo put per effettuare
     * l'update del profilo
     * @param idProfile 
     * @param profile 
     * @returns 
     */
    updateAccount(idProfile: string, profile: Profile){
        return this.http.put<Profile>(
            `https://insta-clone-7660e-default-rtdb.firebaseio.com/profiles/${idProfile}.json`,
            profile
        );
    }
    /**
     * metodo che mi permette di creare un post e memorizzarlo
     * nel db. subscribe delegata al chiamante
     * @param post 
     */
    createPost(post: Post){
        let ora = new Date(Date.now());
        post.dataPost = ora;

        return this.http.post<Post>(
            `https://insta-clone-7660e-default-rtdb.firebaseio.com/posts.json`,
            post
        );
    }
    /**
     * metodo che mi permette di prendere tutti i post del DB.
     * Subscription delegata al chiamante.
     */
    fetchPosts(){
        return this.http.get<Post[]>(
            `https://insta-clone-7660e-default-rtdb.firebaseio.com/posts.json`
        ).pipe(
            map(responsePosts => {
                let arrayPosts: Post[] = [];
                for(const key in responsePosts){
                    if(responsePosts.hasOwnProperty(key)){
                        arrayPosts.push({...responsePosts[key]});
                    }
                }
                return arrayPosts;
            })
        );
    }
    /**
     * metodo per prendere 
     * @param idProfile 
     */
    fetchPostsByIdProfile(idProfile: string): Post[]{
        let postsSearched: Post[] = [];

        this.http.get<Post[]>(
            `https://insta-clone-7660e-default-rtdb.firebaseio.com/posts.json`
        ).pipe(
            map(responsePosts => {
                /**
                 * popolamento dell'array di Post da ritornare 
                 */
                for(const key in responsePosts){
                    if(responsePosts.hasOwnProperty(key)){
                        let post = {...responsePosts[key]};
                        if(post.idProfile === idProfile){
                            postsSearched.push(post);
                        }
                    }
                }
                /**
                 * ordinamento dell'array di Post per data da ritornare
                 */
                postsSearched = postsSearched.sort((a: Post, b: Post) => {
                    let res = new Date(b.dataPost).getDate() - 
                            new Date(a.dataPost).getTime();
                    return res;
                });
                return postsSearched;
            })
        ).subscribe(posts => {
            postsSearched = posts;
        });
        return postsSearched;
    }
    /**
     * metodo che mi permette di aggiungere un commento ad un post.
     * Subscription delegata al chiamante
     * @param commento body chiamata HTTP
     */
    createComment(commento: Commento){
        return this.http.post<Commento>(
            `https://insta-clone-7660e-default-rtdb.firebaseio.com/comments.json`,
            commento
        );
    }


    /**
     * metodo che ritorna tutti i commenti presenti nel db.
     * subscribe da invocare.
     */
    fetchComments(){
        let comments: Commento[] = [];

        return this.http.get<Commento[]>(
            `https://insta-clone-7660e-default-rtdb.firebaseio.com/comments.json`
        ).pipe(
            map(responseComments => {
                const arrayComments: Commento[] = [];
                /**
                 * operazione di filtraggio dei commenti
                 */
                for(const key in responseComments){
                    if(responseComments.hasOwnProperty(key)){
                        arrayComments.push({...responseComments[key]});
                    }
                }
                return arrayComments;
            })
        );
    }

    /**
     * metodo che mi permette di prendere tutti i like del db, 
     * su cui dovrò poi fare la subscribe.
     */
    getLikes(){
        return this.http.get<Like[]>(
            `https://insta-clone-7660e-default-rtdb.firebaseio.com/likes.json`
        ).pipe(
            map(responseLikes => {
                const likeArray: Like[] = [];
                for(const key in responseLikes){
                    if(responseLikes.hasOwnProperty(key)){
                        likeArray.push({...responseLikes[key]});
                    }
                }
                return likeArray;
            })
        );
    }
    /**
     * metodo che permette di aggiungere un like al db.
     * subscription delegata al chiamante
     * @param like body http 
     */
    addLike(like: Like){
        return this.http.post<Like>(
            `https://insta-clone-7660e-default-rtdb.firebaseio.com/likes.json`,
            like
        );
    }

    /**
     * metodo che effettua una delete dal database del like.
     * subscription delegata al metodo chiamante
     */
    removeLike(idPost: string, idSession: string){
        return this.http.get<Like[]>(
            `https://insta-clone-7660e-default-rtdb.firebaseio.com/likes.json`
        );
    }
    /**
     * metodo che prepara la chiamata http per effettuare un follow 
     * @param follow 
     * @returns observable su cui effettuare la subscription
     */
    addFollow(follow: Follow){
        return this.http.post<Follow>(
            `https://insta-clone-7660e-default-rtdb.firebaseio.com/follows.json`,
            follow
        );
    }
    /**
     * metodo che raccoglie tutti i follow del db, 
     * su cui dovrò poi fare la subscribe
     */
    getFollows(){
        return this.http.get<Follow[]>(
            `https://insta-clone-7660e-default-rtdb.firebaseio.com/follows.json`
        ).pipe(
            map(responseFollows => {
                const followsArray: Follow[] = [];
                for(const key in responseFollows){
                    if(responseFollows.hasOwnProperty(key)){
                        followsArray.push({...responseFollows[key]});
                    }
                }
                return followsArray;
            })
        );
    }
    /**
     * 
     * @returns observable su cui fare la subscription.
     * utilizzato principalmente per rimuovere il follow
     */
    fetchFollows(){
        return this.http.get<Follow[]>(
            `https://insta-clone-7660e-default-rtdb.firebaseio.com/follows.json`
        );
    }

    deleteFollow(idFollow: string){
        return this.http.delete<Follow>(
            `https://insta-clone-7660e-default-rtdb.firebaseio.com/follows/${idFollow}.json`
        );
    }

    /**
     * sezione like al commento:
     * questo metodo prende tutti i like al commento
     */
    fetchCommentLikes(){
        return this.http.get<CommentoLike[]>(
            `https://insta-clone-7660e-default-rtdb.firebaseio.com/commentlikes.json`
        ).pipe(
            map(responseCommentLikes => {
                const commentLikesArray: CommentoLike[] = [];
                for(const key in responseCommentLikes){
                    if(responseCommentLikes.hasOwnProperty(key)){
                        commentLikesArray.push({...responseCommentLikes[key]});
                    }
                }
                return commentLikesArray;
            })
        )
    }
    /**
     * metodo che mi permette di aggiungere un like ad un commento nel mio DB
     */
    addCommentLike(commentLike: CommentoLike){
        return this.http.post<CommentoLike>(
            `https://insta-clone-7660e-default-rtdb.firebaseio.com/commentlikes.json`,
            commentLike
        );
    }
}
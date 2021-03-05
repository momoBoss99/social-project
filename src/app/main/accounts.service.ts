import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Profile } from "../shared/profile.model";
import { map} from 'rxjs/operators';
import { Post } from "../shared/post.model";
import { Commento } from "../shared/commento.model";
import { Like } from "../shared/like.model";


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
     * metodo che ritorna direttamente il profilo cercato dato il 
     * suo id (proprietà)
     * @param id id del profilo da cercare nel DB
    
    fetchAccount(id: string): Profile {
        let profileSearched: Profile;
        
        
        this.fetchAccounts().subscribe(responseProfiles => {
            for(let profile of responseProfiles){
                if(profile.id === id){
                    console.log('profilo trovato');
                    profileSearched = profile;
                    console.log(profileSearched);
                    return profileSearched;
                }
            }
            console.log('profilo non trovato');
        });
        console.log(profileSearched);
        return profileSearched;
    }

    */
    /**
     * FIXME
     * @param nameLike 
     */
    fetchAccountsSearch(nameLike: string){
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
     * metodo che mi permette di creare un post e memorizzarlo
     * nel db
     * @param post 
     */
    createPost(post: Post){
        let ora = new Date(Date.now());
        post.dataPost = ora;

        this.http.post(
            `https://insta-clone-7660e-default-rtdb.firebaseio.com/posts.json`,
            post
        ).subscribe(responseData => {
            console.log(responseData);
        }, error => {
            console.log(error);
        });
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
     * metodo che mi permette di fare una get di un singolo post dal DB
     * per visuallizare il dettaglio del post
     * @param idPost 
     */
    fetchPost(idPost: string): Post{
        let postSearched: Post = null;

        this.fetchPosts().subscribe(
            responsePosts => {
                for(let post of responsePosts){
                    if(post.idPost === idPost){
                        postSearched = post;
                        return;
                    }
                }
            }
        )

        return postSearched;
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
     * metodo che ritorna tutti i commenti relativi ad un post 
     * dato l'id del post.
     * @param idPost 
     */
    fetchComments(idPost: string): Commento[]{
        let comments: Commento[] = [];

        this.http.get<Commento[]>(
            `https://insta-clone-7660e-default-rtdb.firebaseio.com/comments.json`
        ).pipe(
            map(responseComments => {
                /**
                 * operazione di filtraggio dei commenti
                 */
                for(const key in responseComments){
                    if(responseComments.hasOwnProperty(key)){
                        let comment: Commento = {...responseComments[key]};
                        if(comment.idPost === idPost){
                            comments.push(comment);
                        }
                    }
                }
                return comments;
            })
        ).subscribe(comments => {
            comments = comments;
        }, error => {
            console.log(error);
        });

        return comments;
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
        let idLike = this.getIdLike(idPost, idSession);

        return this.http.delete<Like>(
            `https://insta-clone-7660e-default-rtdb.firebaseio.com/likes/${idLike}.json`
        );
    }
    /**
     * metodo ausiliario che dato un id del post e id utente,
     * mi fornisce l'id del like nel database per poter
     * effettuare una delete 
     */
    private getIdLike(idPost: string, idSession: string): string{
        return null;
    }
}
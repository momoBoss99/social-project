import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Post } from "../shared/post.model";
import { Profile } from "../shared/profile.model";
import { map} from 'rxjs/operators';
import { Commento } from "../shared/commento.model";
import { CommandName } from "protractor";
import { Subject } from "rxjs";
import { Like } from "../shared/like.model";
/**
 * questo service mi serve per connettermi al DB
 * e fare le operazioni CRUD
 */

@Injectable({
    providedIn: 'root'
})
export default class ProfilesService {
    constructor(private http: HttpClient){}
    /**
     * questo metodo prepara la chiamata http di get di tutti i profili
     * presenti nella mia applicazione
     */
    fetchAccounts(){
        return this.http.get<Profile[]>(
            'https://social-project-3d34c-default-rtdb.firebaseio.com/profiles.json'
        );
    }

    /**
     * metodo che prepara la chiamata http di get di tutti i profili che hanno
     * nickname simile a quello ricevuto come parametro in ingresso
     * @param nameLike 
     */
    fetchAccountsSearch(nameLike: string){

    }
    /**
     * metodo che prepara la chiamata http di tipo get di 
     * un profilo da fetchare dato l'id
     * @param id numero che identifica l'id dell'utente da 
     * fetchare dal db
     */
    fetchAccount(id: number){
        return this.http.get<Profile>(
            `https://social-project-3d34c-default-rtdb.firebaseio.com/profiles/${id}.json`
        );
    }

    /**
     * metodo che mi permette di salvare un nuovo profilo nel mio db
     */
    onCreateAccount(profilo: Profile){
        this.http.post(
            `https://social-project-3d34c-default-rtdb.firebaseio.com/profiles/${profilo.id}.json`,
            profilo
        ).subscribe(responseData => {
            console.log(responseData);
        });
    }

    /**
     * metodo che mi permette di creare un post e memorizzarlo
     * nel db
     * @param post post in ingresso
     */
    onCreatePost(post: Post){
        let ora = new Date(Date.now());
        post.dataPost = ora;

        this.http.post(
            `https://social-project-3d34c-default-rtdb.firebaseio.com/posts/${post.idProfile}/${post.idPost}.json`, post
        ).subscribe(responseData => {
            console.log(responseData);
        })
    }

    /**
     * metodo che prepara la chiamata di tipo get per chiedere i post
     * al db dato l'id dell'utente
     * @param idUtente id che identifica l'utente di cui voglio 
     * raccogliere i post dal db
     */
    onFetchPosts(idUtente: number){
        return this.http.get<Post[]>(
            `https://social-project-3d34c-default-rtdb.firebaseio.com/posts/${idUtente}.json`
        ).pipe(
            map(responseData => {
                let arrayPost: Post[] = [];
                arrayPost = responseData;
                /**
                 * sorting dei post per data di pubblicazione
                 */
                arrayPost = arrayPost.sort((a: Post, b: Post) => {
                    let res = new Date(b.dataPost).getDate() - 
                            new Date(a.dataPost).getTime();
                    return res;
                });
                return arrayPost;
            })
        )
    }

    /**
     * faccio una chiamata get che mi raccoglie i vari post di tutti
     * gli utenti che hanno fatto dei post.
     * sulla chiamata bisogna ancora fare .subscribe().
     * i post sono ordinati per data di pubblicazione
     */
    getAllPosts(){
        return this.http.get<Post[]>(
            `https://social-project-3d34c-default-rtdb.firebaseio.com/posts.json`
        ).pipe(
            map(responseData => {
                let arrayPost: Post[] = [];

                for(const key in responseData){
                    if(responseData.hasOwnProperty(key)){
                        arrayPost.push({...responseData[key]});
                    }
                }
                console.log(arrayPost);
                /**
                 * sorting dei post per data di pubblicazione
                 */
                arrayPost = arrayPost.sort((a: Post, b: Post) => {
                    let res = new Date(b.dataPost).getDate() - 
                            new Date(a.dataPost).getTime();
                    return res;
                });
                return arrayPost;
            })
        );
    }

    /**
     * metodo che mi permette di fare una get di un singolo post nel database (per visualizzare il dettaglio)
     * sul metodo devo ancora fare la subscribe
     * @param id codice identificativo del post
     */
    getPost(id: number){
        return this.http.get<Post>(
            `https://social-project-3d34c-default-rtdb.firebaseio.com/posts/${id}.json`
        );
    }

    /**
     * 
     * @param post post modificato da inserire al posto di quello
     * che c'era
     */
    onUpdatePost(post: Post){
        this.http.put<Post>(
            `https://social-project-3d34c-default-rtdb.firebaseio.com/posts/${post.idProfile}/${post.idPost}.json`, post
        ).subscribe(responseData => {
            console.log(responseData);
        })
    }

    /**
     * metodo che mi permette di aggiungere un commento ad un post
     */
    onAddComment(commento: Commento){
        return this.http.post<Commento>(
            `https://social-project-3d34c-default-rtdb.firebaseio.com/comments.json`, commento
        );
    }

    /**
     * metodo che mi permette di fare il fetch di tutti i commenti
     */
    getComments(){
        return this.http.get<Commento[]>(
            `https://social-project-3d34c-default-rtdb.firebaseio.com/comments.json`
        ).pipe(
            map(responseData => {
                const commentiArray: Commento[] = [];
                for(const key in responseData){
                    if(responseData.hasOwnProperty(key)){
                        commentiArray.push({...responseData[key]});
                    }
                }
                return commentiArray;
            })
        )
        ;
    }

    /**
     * metodo che prende tutti i like del db e su cui dovrò 
     * fare la subscribe e il filtraggio per id del post
     */
    getLikes(){
        return this.http.get<Like[]>(
            `https://social-project-3d34c-default-rtdb.firebaseio.com/likes.json`
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
            )
    }

    /**
     * metodo che mi permette di aggiungere un like al database,
     * contente già le informazioni relative al post e a chi mette
     * il like al post
     * @param like body della chiamata http
     */
    addLike(like: Like){
        return this.http.post<Like>(
            `https://social-project-3d34c-default-rtdb.firebaseio.com/likes.json`, like
        );
    }
}
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Post } from "../shared/post.model";
import { Profile } from "../shared/profile.model";
import { map} from 'rxjs/operators';
import { Commento } from "../shared/commento.model";
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
            `https://social-project-3d34c-default-rtdb.firebaseio.com/posts/.json`
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
        this.http.post<Commento>(
            `https://social-project-3d34c-default-rtdb.firebaseio.com/posts/${commento.idProfilo}/${commento.idPost}/comments.json`, commento
        ).subscribe(responseData => {
            console.log(responseData);
        })
    }
}
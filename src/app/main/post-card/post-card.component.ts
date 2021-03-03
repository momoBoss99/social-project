import { Component, Input, OnInit } from "@angular/core";
import { Commento } from "src/app/shared/commento.model";
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
    loadingComment: boolean = false;
    commento: string;
    commentoInviato: boolean = false;

    constructor(private profilesService: ProfilesService){}

    ngOnInit(){
        this.loadingComment = false;
        this.getAndFiltraCommenti();
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


}
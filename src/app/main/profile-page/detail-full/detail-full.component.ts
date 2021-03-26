import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Post } from "src/app/shared/post.model";
import { Profile } from "src/app/shared/profile.model";
import { AccountsService } from "../../accounts.service";

@Component({
    selector: 'app-detail-full',
    templateUrl: './detail-full.component.html',
    styleUrls: ['./detail-full.component.scss']
})
export class DetailFullComponent implements OnInit {
    profilo: Profile;
    post: Post;
    idPost: string;
    idProfilo: string;
    loadingProfile: boolean = false;
    loadingPost: boolean = false;

    constructor(private profilesService: AccountsService, private route: Router){}

    ngOnInit(){
        this.getDati();
    }

    private getDati(){
        let startingUrl: number = 6;
        this.idPost = this.route.url.substring(startingUrl, this.route.url.length);
        console.log(this.idPost);
        this.getPost();
    }

    private getPost(){
        this.profilesService.fetchPosts().subscribe(
            responsePosts => {
                for(let post of responsePosts){
                    if(post.idPost === this.idPost){
                        this.post = post;
                        this.loadingPost = true;
                        this.getProfile();
                        break;
                    }
                }
            }
        );
    }

    private getProfile(){
        this.profilesService.fetchAccounts().subscribe(
            responseAccounts => {
                for(let account of responseAccounts){
                    if(account.id === this.post.idProfile){
                        this.profilo = account;
                        this.loadingProfile = true;
                        break;
                    }
                }
            }
        );
    }
}
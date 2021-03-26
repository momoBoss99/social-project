import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Post } from "src/app/shared/post.model";
import { Profile } from "src/app/shared/profile.model";
import { AccountsService } from "../../accounts.service";


@Component({
    selector: 'app-edit-post-card',
    templateUrl: './edit-post-card.component.html',
    styleUrls: ['./edit-post-card.component.scss']
})
export class EditPostCardComponent implements OnInit {
    post: Post;
    profile: Profile;
    idSession: string = JSON.parse(localStorage.getItem("sessione")).id.toString();
    idPost: string;
    descrizione: string;

    constructor(private profilesService: AccountsService, private router: Router){}


    ngOnInit() {
        this.getPost();
        this.getProfile();
    }

    getProfile(){
        this.profilesService.fetchAccounts().subscribe(responseProfiles => {
            for(let profile of responseProfiles){
                if(profile.id === this.idSession){
                    this.profile = profile;
                    this.fillProfile(this.profile);
                    console.log(this.profile);
                    break;
                }
            }
        });
    }
    
    getPost(){
        let startingUrl: number = 11;
        this.idPost = this.router.url.substring(startingUrl, this.router.url.length);
        console.log(this.idPost);
        
        this.profilesService.fetchPosts().subscribe(responsePosts => {
            for(let post of responsePosts){
                if(post.idPost === this.idPost){
                    this.post = post;
                    this.descrizione = this.post.descrizione;
                    console.log(this.post);
                    break;
                }
            }
        })
    }

    onSubmit(){
        console.log('prova modifica descrizione');
        this.profilesService.prepareFetchPost().subscribe(responsePosts => {
            for(const key in responsePosts){
                if(responsePosts.hasOwnProperty(key)){
                    let tmp = {...responsePosts[key]};
                    if(tmp.idPost === this.idPost){
                        console.log("post trovato nel db");
                        let updatedPost: Post = this.post;
                        updatedPost.descrizione = this.descrizione;
                        this.profilesService.updatePost(key, updatedPost).subscribe(response => {
                            console.log(response);
                            this.router.navigate(['/profiles', this.idSession]);
                        });
                        break;
                    }
                }
            }
        });
    }

    private fillProfile(profile: Profile){
        if(!profile.proPic || profile.proPic === undefined){
            profile.proPic = "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png";
        }
    }
}
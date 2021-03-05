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


    constructor(private profilesService: AccountsService, private route: Router){}

    ngOnInit(){
        this.getDati();
    }

    private getDati(){
        this.idPost = this.route.url.substring(16, this.route.url.length);
        console.log(this.idPost);
        this.post = this.profilesService.fetchPost(this.idPost);
        //this.profilo = this.profilesService.fetchAccount(this.post.idProfile);
        /*
        this.profilesService.getPost(this.idPost).subscribe(
            responsePost => {
                this.post = responsePost;
                this.idProfilo = this.post.idProfile;
                this.profilesService.fetchAccount(this.idProfilo).subscribe(
                    responseProfile => {
                        this.profilo = responseProfile;
                    }
                );
            }
        );*/
    }
}
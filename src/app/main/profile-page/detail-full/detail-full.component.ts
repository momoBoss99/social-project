import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Post } from "src/app/shared/post.model";
import { Profile } from "src/app/shared/profile.model";
import ProfilesService from "../../profiles.service";

@Component({
    selector: 'app-detail-full',
    templateUrl: './detail-full.component.html',
    styleUrls: ['./detail-full.component.scss']
})
export class DetailFullComponent implements OnInit {
    profilo: Profile;
    post: Post;
    idPost: number;
    idProfilo: number;


    constructor(private profilesService: ProfilesService, private route: Router){}

    ngOnInit(){
        this.getDati();
    }

    private getDati(){
        this.idPost = parseInt(this.route.url.substring(16, this.route.url.length));
        console.log(this.idPost);
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
        );
    }

}
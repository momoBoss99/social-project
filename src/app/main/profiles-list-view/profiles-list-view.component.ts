import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Profile } from "src/app/shared/profile.model";
import { AccountsService } from "../accounts.service";

enum ListMode {
    likesAlPost = 0,
    followersProfilo = 1,
    followingProfilo = 2,
    errore = 3,
}

@Component({
    selector: 'app-profiles-list-view',
    templateUrl: './profiles-list-view.component.html',
    styleUrls: ['./profiles-list-view.component.css']
})
export class ProfilesListViewComponent implements OnInit {
    url: string;
    typeList: ListMode = ListMode.errore;
    profiles: Profile[] = [];
    loadingProfiles: boolean = false;
    constructor(private profilesService: AccountsService, private router: Router){}

    ngOnInit(){
        this.checkTypeOfList();
        console.log(this.typeList);
        console.log(this.router.url);
        this.fetchData();
    }
    /**
     * metodo che serve a capire che tipo di chiamata al 
     * backend dovrò effettuare
     */
    private checkTypeOfList() {
        this.url = this.router.url.substring(0, 16);
        switch(this.url){
            case '/profiles/list/l':
                this.typeList = ListMode.likesAlPost;
                break;
            case '/profiles/list/f':
                this.url = this.router.url.substring(0, 22);
                if(this.url === '/profiles/list/followe'){
                    this.typeList = ListMode.followersProfilo;
                }
                else if(this.url === '/profiles/list/follows'){
                    this.typeList = ListMode.followingProfilo;
                }
                break;
            default:
                console.log('debugga il check del url');
                break;
        }
    }
    /**
     * metodo wrapper per effettuare le chiamate al backend
     */
    private fetchData(){
        switch(+this.typeList){
            case ListMode.likesAlPost:
                this.getLikes();
                break;
            case ListMode.followersProfilo: 
                this.getFollowers();
                break;
            case ListMode.followingProfilo: 
                this.getFollowing();
                break;
            default:
                console.log('errore');
                break;
        }
    }
    /**
     * metodo che mi permette di raccogliere i profili che hanno messo like al post
     */
    private getLikes(){
        let startId: number = 21;
        let idPost: string = this.router.url.substring(startId, this.router.url.length);
        console.log(idPost);

        this.profilesService.fetchAccounts().subscribe(
            responseProfiles => {
                this.profilesService.getLikes().subscribe(
                    responseLikes => {
                        for(let profile of responseProfiles){
                            for(let like of responseLikes){
                                if(profile.id === like.idProfileLiker && like.idPost === idPost){
                                    this.profiles.push(profile);
                                }
                            }
                        }
                        this.loadingProfiles = true;
                        console.log(this.profiles);
                    }
                )
            }
        );
    }

    private getFollowers(){
        let startId: number = 25;
        let idProfile: string = this.router.url.substring(startId, this.router.url.length);
        console.log(idProfile);

        this.profilesService.fetchAccounts().subscribe(responseAccounts => {
            this.profilesService.getFollows().subscribe(responseFollows => {
                for(let profile of responseAccounts){
                    for(let follow of responseFollows){
                        if(profile.id === follow.idFollower && idProfile === follow.idFollowed){
                            this.profiles.push(profile);
                        }
                    }
                }
                this.loadingProfiles = true;
                console.log(this.profiles);
            });
        });
    }

    private getFollowing(){
        let startId: number = 23;
        let idProfile: string = this.router.url.substring(startId, this.router.url.length);
        console.log(idProfile);

        this.profilesService.fetchAccounts().subscribe(responseAccounts => {
            this.profilesService.getFollows().subscribe(responseFollows => {
                for(let profile of responseAccounts){
                    for(let follow of responseFollows){
                        if(profile.id === follow.idFollowed && idProfile === follow.idFollower){
                            this.profiles.push(profile);
                        }
                    }
                }
                this.loadingProfiles = true;
                console.log(this.profiles);
            });
        });
    }
}
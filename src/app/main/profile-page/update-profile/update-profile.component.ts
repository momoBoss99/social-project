import { Component, OnInit, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Profile } from "src/app/shared/profile.model";
import { AccountsService } from "../../accounts.service";

@Component({
    selector: 'app-update-profile',
    templateUrl: './update-profile.component.html',
    styleUrls: ['./update-profile.component.css']
})
export class UpdateProfileComponent implements OnInit{
    @ViewChild('f') updateProfileForm: NgForm;
    nickname = document.getElementById('')
    profile: Profile;
    loadingProfile: boolean = false;
    idSession: string = JSON.parse(localStorage.getItem("sessione")).id.toString();

    constructor(private profilesService: AccountsService){}

    ngOnInit(){
        this.getProfile();
    }

    onSumbit(){
        console.log(this.updateProfileForm.value);
        let profileUpdated: Profile = new Profile(this.idSession, this.updateProfileForm.value.nome, this.updateProfileForm.value.nickname,this.profile.followers, this.profile.following, this.updateProfileForm.value.biografia, this.updateProfileForm.value.proPic, this.profile.email);
        console.log(profileUpdated);
        this.profilesService.prepareUpdateAccount().subscribe(responseProfiles => {
            for(const key in responseProfiles){
                if(responseProfiles.hasOwnProperty(key)){
                    if(responseProfiles[key].id === this.idSession){
                        console.log('profilo trovato');
                        this.profilesService.updateAccount(key, profileUpdated).subscribe(response => {
                            console.log(response);
                            /**
                             * navigazione al profilo
                             */
                        });
                        break;
                    }
                }
            }
        });
    }

    private getProfile(){
        this.profilesService.fetchAccounts().subscribe(responseProfiles => {
            for(let profile of responseProfiles){
                if(profile.id === this.idSession){
                    console.log('profilo trovato!');
                    this.profile = profile;
                    this.loadingProfile = true;
                }
            }
        })
    }
}
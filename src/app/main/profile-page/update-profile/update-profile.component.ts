import { Component, OnInit, ViewChild } from "@angular/core";
import { FormControl, FormGroup, NgForm, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Profile } from "src/app/shared/profile.model";
import { AccountsService } from "../../accounts.service";

@Component({
    selector: 'app-update-profile',
    templateUrl: './update-profile.component.html',
    styleUrls: ['./update-profile.component.css']
})
export class UpdateProfileComponent implements OnInit{
    @ViewChild('f') updateProfileForm: NgForm;
    profile: Profile;
    loadingProfile: boolean = false;
    idSession: string = JSON.parse(localStorage.getItem("sessione")).id.toString();
    /**
     * cambio email e password
     */
    emailForm: FormGroup;
    emailChangeSubmitted: boolean = false;

    constructor(private profilesService: AccountsService, private router: Router){}

    ngOnInit(){
        this.getProfile();
    }

    onSumbit(){
        console.log(this.updateProfileForm.value);
        let profileUpdated: Profile = new Profile(this.idSession, this.updateProfileForm.value.nome, this.updateProfileForm.value.nickname, this.updateProfileForm.value.biografia, this.updateProfileForm.value.proPic, this.profile.email);

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
                            this.router.navigate([`/profiles/${this.idSession}`]);
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
                    this.startingEmailForm();
                }
            }
        })
    }

    private startingEmailForm(){
        this.emailForm = new FormGroup({
            'email': new FormControl(this.profile.email, [Validators.required, Validators.email]),
            'password': new FormControl(null, [Validators.required, this.checkPassword.bind(this)]),
            'confirm': new FormControl(null, [Validators.required, this.checkPassword.bind(this)])
        });
    }

    private checkPassword(control: FormControl): {[s: string]: boolean} {
        if(control.value === this.profile.password) {
            /**
             * correct psw
             */
            return null;
        }
        return {'passwordIncorrect' : true};
    }


    onChangeMail(){
        console.log(this.emailForm);
        this.emailChangeSubmitted = true;
        if((this.emailForm.get('password').valid && 
            this.emailForm.get('confirm').valid ) && 
            this.emailForm.touched){

                let profileUpdated: Profile = this.profile;
                profileUpdated.email = this.emailForm.value.email;
                

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
                                    this.router.navigate([`/profiles/${this.idSession}`]);
                                });
                                break;
                            }
                        }
                    }
                })
            }

    }
}
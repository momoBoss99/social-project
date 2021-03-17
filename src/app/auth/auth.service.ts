import { Injectable, OnInit } from "@angular/core";
import { AccountsService } from "../main/accounts.service";
import { Profile } from "../shared/profile.model";
import { UUID } from 'angular2-uuid';

/**
 * 
 */
@Injectable({
    providedIn: 'root'
})
export class AuthService implements OnInit{
    profiles: Profile[] = [];
    defaultPassword: string = "password";

    constructor(private profilesService: AccountsService){
        this.profilesService.fetchAccounts().subscribe(responseProfiles => {
            this.profiles = responseProfiles;
            console.log(this.profiles);
        });
    }


    ngOnInit() {
    }

    /**
     * metodo per la registrazione di un nuovo profilo nel db
     * da modificare dopo aver modificato l'entità Profile
     * @param email 
     * @param password 
     * @param username 
     */
    signup(email: string, password: string, username: string){ 
        let id = UUID.UUID();
        let newProfile: Profile = new Profile(id, username, username, null, null, email, password);
        this.profiles.push(newProfile);
        this.profilesService.createAccount(newProfile).subscribe(response => {
            console.log(response);
        });
    }
    
    login(email: string, password: string){
        console.log(email);
        console.log(password);
        for(let profile of this.profiles){
            if(profile.email === email && profile.password === password){
                /**
                 * aggiungere successivamente il check per 
                 * psw
                 */
                console.log('account trovato');
                localStorage.setItem("sessione", JSON.stringify(profile));
                return true;
            }
        }
        return false;
    }

    logout(){
        localStorage.removeItem("sessione");
    }

    resetPassword(email: string){
        this.profilesService.prepareUpdateAccount().subscribe(responseProfiles => {
            for(const key in responseProfiles){
                if(responseProfiles.hasOwnProperty(key)){
                    let tmp: Profile = {...responseProfiles[key]};
                    if(tmp.email === email){
                        /**
                         * account trovato, aggiungere 
                         * modifica psw dopo aver modificato
                         * la classe Profile
                         */
                        tmp.password = this.defaultPassword;
                        this.profilesService.updateAccount(key, tmp).subscribe(response => {
                            console.log(response);
                        });
                    }
                }
            }
        });
    }
}
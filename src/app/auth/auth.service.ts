import { Injectable, OnInit } from "@angular/core";
import { AccountsService } from "../main/accounts.service";
import { Profile } from "../shared/profile.model";
import { UUID } from 'angular2-uuid';
import { Subject } from "rxjs";

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
    }


    ngOnInit() {
        this.profilesService.fetchAccounts().subscribe(responseProfiles => {
            this.profiles = responseProfiles;
            console.log(this.profiles);
        });
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
        //this.profiles.push(newProfile);
        this.profilesService.createAccount(newProfile).subscribe(response => {
            console.log(response);
        });
    }
    
    login(email: string, password: string){
        console.log(email);
        console.log(password);
        let flag = new Subject<boolean>();
        let found: boolean = false;
        this.profilesService.fetchAccounts().subscribe(responseProfiles => {
            for(let profile of responseProfiles){
                if(profile.email === email && profile.password === password){
                    localStorage.setItem("sessione", JSON.stringify(profile));
                    flag.next(true);
                    found = true;
                    break;
                }
            }
            if(!found){
                flag.next(false);
            }
        });
        return flag.asObservable();
    }

    logout(){
        localStorage.removeItem("sessione");
    }

    resetPassword(email: string){
        let flag = new Subject<boolean>();
        console.log(email);
        this.profilesService.prepareUpdateAccount().subscribe(responseProfiles => {
            for(const key in responseProfiles){
                if(responseProfiles.hasOwnProperty(key)){
                    let tmp: Profile = {...responseProfiles[key]};
                    if(tmp.email === email){
                        this.profilesService.updateAccount(key, tmp).subscribe(response => {
                            flag.next(true);
                        });
                        return;
                    }
                }
            }
            flag.next(false);
        });
        return flag;
    }
}
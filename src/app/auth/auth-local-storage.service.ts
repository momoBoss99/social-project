import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { AccountsService } from "../main/accounts.service";
import { Profile } from "../shared/profile.model";

/**
 * fake service di autenticazione che utilizza il local storage
 * per registrare/loggare utenti.
 * Verrà rimpiazzato dal backend
 */
@Injectable({
    providedIn: 'root'
})
export class AuthLocalStorage {
    loggedIn: boolean = false;
    constructor(private http: HttpClient,
                private router: Router,
                private profilesService: AccountsService){}

    /**
     * fake signup with localStorage
     */
    signup(email: string, password: string, username: string){
        /**
         * prendo gli utenti presenti nel localStorage, al più 
         * l'array vuoto se non vi sono utenti salvati
         */
        let users: {email: string, password: string, id: number}[] = [];
        let id: number;
        users = JSON.parse(localStorage.getItem("utenti") || "[]");
        if(users.length == 0){
            id = 0;
        }
        else {
            id = users[users.length-1].id + 1;
        }
        users.push({email, password, id});
        /**
         * creazione dell'utente nel database effettivo
         */
        this.profilesService.createAccount(new Profile(id.toString(), username, username, 0, 0, "perchè non aggiungi una biografia?", "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png", email));

        localStorage.setItem("utenti", JSON.stringify(users));
        console.log(JSON.parse(localStorage.getItem("utenti")));
    }
    /**
     * 
     */
    login(email: string, password: string) : boolean {
        let users: {email: string, password: string, id: number}[] = [];
        users = JSON.parse(localStorage.getItem("utenti") || "[]");
        if(users.length == 0){
            console.log("non ci sono utenti");
            this.loggedIn = false;
            return false;
        }
        else {
            for(let user of users){
                if(user.email === email){
                    if(user.password === password){
                        console.log(user);
                        console.log("user trovato");
                        localStorage.setItem("sessione", JSON.stringify(user));
                        this.loggedIn = true;
                        return true;
                    }
                }
            }
            console.log("user non trovato");
        }
        return false;
    }
    /**
     * 
     */
    logout(){
        localStorage.removeItem("sessione");
        this.loggedIn = false;
    }
    /**
     * metodo per fare il reset della password ad una password di default
     * @param email email utente di cui voglio resettare la password
     */
    resetPassword(email: string){
        let users: {email: string, password: string, id: number}[] = [];
        users = JSON.parse(localStorage.getItem("utenti") || "[]");
        if(users.length == 0){
            console.log('non ci sono utenti registrati!');
        }
        else {
            for(let user of users){
                if(user.email === email){
                    user.password = 'password';
                    console.log('password di ' + user.email + 'resettata');
                    break;
                }
            }
            localStorage.setItem("utenti", JSON.stringify(users));
        }
    }
}
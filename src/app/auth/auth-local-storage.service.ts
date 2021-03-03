import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

/**
 * fake service di autenticazione che utilizza il local storage 
 * per registrare/loggare utenti.
 * Verrà rimpiazzato dal backend
 */
@Injectable({
    providedIn: 'root'
})
export class AuthLocalStorage {
    constructor(private http: HttpClient, private router: Router){}

    /**
     * fake signup with localStorage
     */
    signup(email: string, password: string, id: string){
        /**
         * prendo gli utenti presenti nel localStorage, al più 
         * l'array vuoto se non vi sono utenti salvati
         */
        let users: {email, password, id}[] = [];
        users = JSON.parse(localStorage.getItem("utenti") || "[]");
        users.push({email, password, id});
        localStorage.setItem("utenti", JSON.stringify(users));
        console.log(JSON.parse(localStorage.getItem("utenti")));
    }
    /**
     * 
     */
    login(){}
    /**
     * 
     */
    logout(){}
}
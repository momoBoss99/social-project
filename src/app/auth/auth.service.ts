import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject } from "rxjs";
import { tap } from "rxjs/operators";
import { User } from "../shared/user.model";


export interface AuthResponseData {
    kind: string;
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registred?: boolean;
}
/**
 * 
 */
@Injectable({
    providedIn: 'root'
})
export class AuthService {
    user = new BehaviorSubject<User>(null);
    /**
     * variabile che serve a auto-sloggare un utente dopo un certo periodo di 
     * tempo dall'applicazione
     */
    private tokenExpirationTimer: any;


    constructor(private http: HttpClient, private router: Router){}

    /**
     * metodo per la registrazione di un nuovo utente nell'applicazione,
     * ritorna un observable su cui fare poi il subscribe
     */
    signup(email: string, password: string){
        return this.http.post<AuthResponseData>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBZD8cmFCHgGE4iDwkYmfqu1vIJcpVBJEw', 
            {
                email: email,
                password: password,
                returnSecureToken: true
            }
        ).pipe(tap(responseData => {
            const expirationDate = new Date(new Date().getTime() + +responseData.expiresIn*1000);
            const user = new User(responseData.email, responseData.localId, responseData.idToken, expirationDate);

            this.user.next(user);
        }));
    }

    /**
     * login nell'app che utilizza anche il metodo handleAuthentication per 
     * garantire la persistenza del login
     */
    login(email: string, password: string){
        return this.http.post<AuthResponseData>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBZD8cmFCHgGE4iDwkYmfqu1vIJcpVBJEw',
            {
                email: email,
                password: password,
                returnSecureToken: true
            }
        ).pipe(
            tap(resData => {
                /**
                 * mantengo l'autenticazione persistenze al refresh della pagina
                 */
                this.handleAuthentication(resData.email, resData.localId, resData.idToken, 
                                        +resData.expiresIn);
            }));
    }

    /**
     * logout dall'applicazione (pulizia del localStorage)
     */
    logout(){
        this.user.next(null);
        this.router.navigate(['']);
        localStorage.removeItem('userData');
        if(this.tokenExpirationTimer){
            clearTimeout(this.tokenExpirationTimer);
        }
        this.tokenExpirationTimer = null;
    }

    /**
     * metodo privato che garantisce la persistenza del login di un utente 
     * anche quando aggiorno la pagina, utilizzando il localStorage del browser
     */
    private handleAuthentication(email: string, userId: string,  token: string, expiresIn: number){
        const expirationDate = new Date(new Date().getTime() + expiresIn*1000);
        const user = new User(email, userId, token, expirationDate);
        this.user.next(user);

        this.autoLogout(expiresIn * 1000);
        localStorage.setItem('userData', JSON.stringify(user));
    }

    /**
     * metodo ausiliario al metodo handleAuthentication
     */
    autoLogout(expirationDuration: number){
        this.tokenExpirationTimer = setTimeout(() => {
            this.logout();
        }, expirationDuration);
    }

    /**
     * 
     */
    autoLogin(){
        // converto la stringa a un oggetto JavaScript (user)
        const userData: {
            email: string;
            id: string;
            _token: string;
            _tokenExpiraionDate: string;
        } = JSON.parse(localStorage.getItem('userData'));
        /**
         * se non ci sono dati relativi al login nello storage, allora ritorno
         */
        if(!userData){
            return;
        }

        const loadedUser = new User(userData.email, userData.id, userData._token,
            new Date(userData._tokenExpiraionDate));
        
        if(loadedUser.token){
            this.user.next(loadedUser);
            const expirationDuration = new Date(userData._tokenExpiraionDate).getTime() - new Date().getTime();
            this.autoLogout(expirationDuration);
        }
    }

}
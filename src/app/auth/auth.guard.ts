import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, CanDeactivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { AuthLocalStorage } from "./auth-local-storage.service";

/**
 * classe guard che serve per poter bloccare le pagine a 
 * chi non è loggato nell'applicazione, implementando 
 * l'interfaccia CanActivate, che mi costringe a implementare
 * il metodo canActivate
 */
@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(private authService: AuthLocalStorage, private router: Router){}

    canActivate(route: ActivatedRouteSnapshot, router: RouterStateSnapshot): boolean | UrlTree | Promise<boolean | UrlTree> | Observable<boolean | UrlTree>{
        if(this.authService.loggedIn){
            return true;
        }
        
        return this.router.createUrlTree(['']);
    }
}
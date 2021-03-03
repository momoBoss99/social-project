import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthLocalStorage } from '../auth-local-storage.service';
import { AuthResponseData, AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @ViewChild('f') registraForm: NgForm;
  authObs: Observable<AuthResponseData>;


  constructor(private authService: AuthLocalStorage, private router: Router) { }

  ngOnInit(): void {
  }

  /**
   * registrazione utente nell'applicazione
   */
  onSubmit(){
    console.log(this.registraForm.value);
    /**
     * controllo sulla correttezza della password
     */
    if(this.registraForm.value.password !== this.registraForm.value.confermapassword){
      console.log("password non valida");
      return;
    }

    const email = this.registraForm.value.email;
    const password = this.registraForm.value.password;
    this.authService.signup(email, password, "id1");
    /*
    this.authObs = this.authService.signup(email, password);

    this.authObs.subscribe(resData => {
      console.log(resData);
      this.router.navigate(['']);
    }, errorMessage => {
      console.log(errorMessage);
    });
    */

    this.registraForm.reset();
  }

}

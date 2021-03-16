import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthLocalStorage } from '../auth-local-storage.service';
import { AuthResponseData, AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @ViewChild('authForm') loginForm: NgForm;
  authObs: Observable<AuthResponseData>;

  constructor(private authService: AuthLocalStorage, private router: Router){}
  ngOnInit(): void {

  }


  onSubmit(){
      console.log(this.loginForm.value.username);
      console.log(this.loginForm.value.password);

      const email = this.loginForm.value.email;
      const password = this.loginForm.value.password;
      if(this.authService.login(email, password)){
        let user: {email: string, password: string, id: number} = JSON.parse(localStorage.getItem("sessione"));
        let idUser: number = user.id;
        this.router.navigate([`/profiles/${idUser}`]);
      } else {
        console.log("login non riuscito");
        window.alert("Ricontrolla email e password!");
      }

  }
}

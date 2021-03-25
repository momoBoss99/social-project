import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  @ViewChild('authForm') loginForm: NgForm;
  errorLogin: boolean = false;
  loginSubscription: Subscription;

  constructor(private authService: AuthService, private router: Router){}

  ngOnInit(): void {

  }


  onSubmit(){
      console.log(this.loginForm.value.username);
      console.log(this.loginForm.value.password);

      const email = this.loginForm.value.email;
      const password = this.loginForm.value.password;
      this.loginSubscription = this.authService.login(email, password).subscribe(response => {
        if(response){
          let user: {email: string, password: string, id: number} = JSON.parse(localStorage.getItem("sessione"));
          let idUser: number = user.id;
          this.router.navigate([`/profiles/${idUser}`]);
        } else {
          this.errorLogin = true;
        }
      })
  }

  ngOnDestroy(): void { 
    this.loginSubscription ? this.loginSubscription.unsubscribe() : null;
  }
}

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
      /*
      this.authObs = this.authService.login(email, password);

      this.authObs.subscribe(resData => {
          console.log(resData);
          console.log('successo');
          this.router.navigate(['/profiles/1']);
      }, errorMessage => {
          console.log(errorMessage);
      });
      */

      this.loginForm.reset();
  }
}

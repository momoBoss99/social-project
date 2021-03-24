import { Component, OnInit, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../auth.service";

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
    @ViewChild('f') resetForm: NgForm;
    errorReset: boolean = false;
    formSubmitted: boolean = false;

    constructor(private authService: AuthService, 
                private router: Router){}

    ngOnInit(){}

    onSubmit(){
        console.log('rest started');
        console.log(this.resetForm.value.email);
        this.authService.resetPassword(this.resetForm.value.email).subscribe(response => {
            if(response){
                console.log('okay');
            }
            else if(!response){
                console.log('error');
                this.errorReset = true;
            }
            this.formSubmitted = true;
        }, error => {
            this.errorReset = true;
            console.log(error);
        });
    }

    onNavigate(){
        this.router.navigate(['']);
    }
}
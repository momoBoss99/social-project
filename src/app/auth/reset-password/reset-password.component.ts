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

    constructor(private authService: AuthService, 
                private router: Router){}

    ngOnInit(){}

    onSubmit(){
        console.log('rest started');
        console.log(this.resetForm.value.email);
        //this.router.navigate(['']);
        this.authService.resetPassword(this.resetForm.value.email);
    }

    onNavigate(){
        this.router.navigate(['']);
    }
}
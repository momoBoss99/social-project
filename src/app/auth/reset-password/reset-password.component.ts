import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { Subject, Subscription } from "rxjs";
import { AuthService } from "../auth.service";

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
    @ViewChild('f') resetForm: NgForm;
    errorReset: boolean = false;
    formSubmitted: boolean = false;
    resetPswSubscription: Subscription;

    constructor(private authService: AuthService, 
                private router: Router){}

    ngOnInit(){}

    onSubmit(){
        console.log('reset started');
        console.log(this.resetForm.value.email);
        this.resetPswSubscription = this.authService.resetPassword(this.resetForm.value.email).subscribe(response => {
            if(response){
                console.log('okay');
            }
            else{
                console.log('error');
                this.errorReset = true;
            }
            this.formSubmitted = true;
        }, error => {
            this.errorReset = true;
            console.log(error);
        });
    }

    ngOnDestroy(): void {
        this.resetPswSubscription ? this.resetPswSubscription.unsubscribe() : null;
    }

    onNavigate(){
        this.router.navigate(['/auth/login']);
    }
}
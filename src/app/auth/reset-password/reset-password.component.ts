import { Component, OnInit, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { AuthLocalStorage } from "../auth-local-storage.service";

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
    @ViewChild('f') resetForm: NgForm;

    constructor(private authService: AuthLocalStorage){}

    ngOnInit(){}

    onSubmit(){
        console.log('rest started');
        console.log(this.resetForm.value.email);
        this.authService.resetPassword(this.resetForm.value.email);
    }
}
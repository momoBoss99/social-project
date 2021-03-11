import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { AuthComponent } from "./auth.component";
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from "./auth.guard";
import { ResetPasswordComponent } from "./reset-password/reset-password.component";


@NgModule({
    declarations: [AuthComponent,
        RegisterComponent, 
        LoginComponent,
        ResetPasswordComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        RouterModule.forChild([
            { path: '', component: AuthComponent, children: [
                { path: '', component: LoginComponent},
                { path: 'register', component: RegisterComponent},
                { path: 'resetpassword', component: ResetPasswordComponent}
            ] }
        ])
    ],
    exports: [
        
    ]
})
export class AuthModule {}
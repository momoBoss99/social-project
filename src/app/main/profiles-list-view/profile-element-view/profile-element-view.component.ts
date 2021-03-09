import { Component, Input, OnInit } from "@angular/core";
import { Profile } from "src/app/shared/profile.model";

@Component({
    selector: 'app-profile-element-view',
    templateUrl: './profile-element-view.component.html',
    styleUrls: ['./profile-element-view.component.css']
})
export class ProfileElementViewComponent implements OnInit {
    @Input('profile') profile: Profile;
    constructor(){
    }

    ngOnInit(){}
}
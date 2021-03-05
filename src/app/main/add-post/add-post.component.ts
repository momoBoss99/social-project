import { Component, OnInit, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Post } from "src/app/shared/post.model";
import { AccountsService } from "../accounts.service";
import { UUID } from 'angular2-uuid';

@Component({
    selector: 'app-add-post',
    templateUrl: './add-post.component.html',
    styleUrls: ['./add-post.component.css']
})
export class AddPostComponent implements OnInit {
    @ViewChild('f') addPostForm: NgForm;
    id;
    constructor(private profilesService: AccountsService){}

    ngOnInit(){}


    onSubmit(){
        console.log(this.addPostForm.value);
        let urlImg = this.addPostForm.value.urlImg;
        let descrizione = this.addPostForm.value.descrizione;
        this.id = UUID.UUID();
        let idSessione: string = JSON.parse(localStorage.getItem("sessione")).id.toString();




        this.profilesService.createPost(new Post(this.id,urlImg,descrizione,
                                        new Date(Date.now()), idSessione)).subscribe(
            response => {
                console.log(response);
            }
        );
    }
}
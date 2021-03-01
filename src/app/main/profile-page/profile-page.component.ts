import { Component, OnInit } from '@angular/core';
import { Post } from 'src/app/shared/post.model';
import { Profile } from 'src/app/shared/profile.model';
import ProfilesService from '../profiles.service';


@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css']
})
export class ProfilePageComponent implements OnInit {
  profilo: Profile;
  idProfilo: number;
  posts: Post[];
  click: boolean = false;

  constructor(private profileService: ProfilesService) { }

  ngOnInit(): void {
    /**
     * id profilo da fixare. Faccio una prova:
     */
    this.idProfilo = 1;
    /**
     * step 1: fetch of all the accounts
     */
    this.profileService.fetchAccount(this.idProfilo).subscribe(
      profiloResponse => {
        this.profilo = profiloResponse;
        console.log(profiloResponse);
        /**
         * step 2: fetch of all the posts of the account
         */
      }
      )
      this.profileService.onFetchPosts(this.idProfilo).subscribe(
        postsResponse => {
          console.log(postsResponse);
          this.posts = postsResponse;
        }
      )
    }


    onOpenPost(){
      this.click = !this.click;
    }

}

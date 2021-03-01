import { Component, OnInit } from '@angular/core';
import { Post } from 'src/app/shared/post.model';
import { Profile } from 'src/app/shared/profile.model';
import ProfilesService from '../profiles.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})

/**
 * faccio una get dei post presenti nel db, gli ordino per ordine cronologico
 * e li dispongo nella home page
 */

export class HomepageComponent implements OnInit {
  /**
   * lavoro con due vettori paralleli, uno dei post e uno dei profili.
   */
  posts: Post[];
  mappaProfiloPost: Map<Profile, Post[]> = new Map();
  profiles: Profile[] = [];
  constructor(private profileService: ProfilesService) { }

  ngOnInit(): void {
    this.fetchPostsInit();
  }

  /**
   * appena viene aperta la home page faccio una chiamata
   * get di tutti i post
   */
  private fetchPostsInit(){
    this.profileService.onFetchPosts(1).subscribe(
      postsResponse => {
        this.posts = postsResponse;
        this.riempiMappa(this.posts);
        this.riempiProfili(this.posts);
      }
    )
  }

  private riempiProfili(posts: Post[]){
    for(let post of posts){
      let profilo: Profile;
      this.profileService.fetchAccount(post.idProfile).subscribe(
        responseProfile => {
          profilo = responseProfile;
          this.profiles.push(profilo);
        }
      )
    }
    console.log(this.profiles);
  }

  private riempiMappa(posts: Post[]){
    posts.forEach(post => {
      let account: Profile;
      this.profileService.fetchAccount(post.idProfile)
      .subscribe(
        responseProfile => {
          account = responseProfile;
          let found: boolean = false;
          for(let key of this.mappaProfiloPost.keys()){
            if(key.id === account.id){
              console.log('il profilo ce');
              found = true;
              this.mappaProfiloPost.get(key).push(post);
              break;
            }
            found = false;
          }
          if(!found){
            console.log('il profilo non ce');
            let postProfilo: Post[] = [];
            postProfilo.push(post);
            this.mappaProfiloPost.set(account, postProfilo);
          }
        }
      )
    });
    console.log(this.mappaProfiloPost);
  }



}

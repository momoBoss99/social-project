import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Post } from 'src/app/shared/post.model';
import { Profile } from 'src/app/shared/profile.model';
import { AccountsService } from '../accounts.service';


@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css']
})
export class ProfilePageComponent implements OnInit {
  profilo: Profile;
  idProfilo: string;
  posts: Post[] = [];
  loadingProfile: boolean = false;
  loadingPosts: boolean = false;
  click: boolean = false;

  constructor(private profileService: AccountsService,
              private router: Router) { }

  ngOnInit(): void {
    this.getProfile();
    this.getPosts();
    }
    /**
     * prende il profilo dal DB
     */
    private getProfile(){
      let inizioIdDaCercare = 10;
      this.idProfilo = this.router.url.substring(inizioIdDaCercare, this.router.url.length);
      console.log(this.idProfilo);
      this.getAccount();
      
      console.log(this.profilo);
    }
    /**
     * prende i post dal DB
     */
    private getPosts(){
      this.profileService.fetchPosts().subscribe(
        responsePosts => {
          for(let post of responsePosts){
            if(post.idProfile === this.idProfilo){
              console.log(post);
              this.posts.push(post);
            }
          }
          console.log(this.posts);
          this.loadingPosts = true;
        }
      );
    }

    openPost(idPost: string){
      this.router.navigate([`/profiles/posts/${idPost}`]);
    }
    /**
     * modale dinamico che apre un modale con dentro solo l'immagine
     * se cliccata l'immagine mi trasporta alla pagina del dettaglio dell'immagine
     */
    onOpenModalPost(){
      this.click = !this.click;
    }

    private getAccount(){
      this.profileService.fetchAccounts().subscribe(
        responseProfiles => {
          for(let profile of responseProfiles){
            if(profile.id === this.idProfilo){
              console.log('profilo trovato');
              this.profilo = profile;
              this.loadingProfile = true;
              break;
            }
          }
          if(this.profilo === undefined){
            console.log('profilo non trovato');
          }
        }
      )
    }


}

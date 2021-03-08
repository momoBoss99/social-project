import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ignoreElements } from 'rxjs/operators';
import { Follow } from 'src/app/shared/follow.model';
import { Post } from 'src/app/shared/post.model';
import { Profile } from 'src/app/shared/profile.model';
import { AccountsService } from '../accounts.service';


@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css']
})
export class ProfilePageComponent implements OnInit {
  idSession: string = JSON.parse(localStorage.getItem("sessione")).id.toString();
  profilo: Profile;
  idProfilo: string;
  posts: Post[] = [];
  loadingProfile: boolean = false;
  loadingPosts: boolean = false;
  myProfile: boolean = false;
  following: boolean = false;
  click: boolean = false;

  constructor(private profileService: AccountsService,
              private router: Router) { }

  ngOnInit(): void {
    this.getProfile();
    this.getPosts();
    this.followCheck();
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
    /**
     * qui faccio il check dell'account: se è il mio, comparirà la possibilità di modificare il profilo.
     * altrimenti, potrò fare il follow
     */
    private getAccount(){
      this.profileService.fetchAccounts().subscribe(
        responseProfiles => {
          for(let profile of responseProfiles){
            if(profile.id === this.idProfilo){
              /**
               * qui faccio il check:
               */
              let idSession = JSON.parse(localStorage.getItem("sessione")).id.toString();
              if(this.idProfilo === this.idSession){
                this.myProfile = true;
                console.log(this.myProfile);
              }
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

    /**
     * metodo che verifica nell'ngOnInit che ci sia già il follow
     */
    private followCheck(){
      this.profileService.getFollows().subscribe(responseFollows => {
          for(let follow of responseFollows){
            if(follow.idFollower === this.idSession && follow.idFollowed === this.idProfilo){
              this.following = true;
              break;
            }
          }
        });
    }
    /**
     * metodo che mi permette di aggiungere/togliere il follow al profilo
     */
    onToggleFollow(){
      console.log('follow toggled!');
      if(this.following){
        this.profileService.fetchFollows().subscribe(responseFollows => {
          for(const key in responseFollows){
            if(responseFollows.hasOwnProperty(key)){
              if(responseFollows[key].idFollowed === this.idProfilo &&
                responseFollows[key].idFollower === this.idSession){
                  console.log("follow trovato");
                  this.profileService.deleteFollow(key).subscribe(response => {
                    this.following = false;
                  })
                }
            }
          }
        })
      }
      else {
        this.profileService.addFollow(new Follow(new Date(Date.now()), this.idSession, this.idProfilo)).subscribe(response => {
          this.following = true;
        })
      }
      this.following = !this.following;
    }

}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthLocalStorage } from 'src/app/auth/auth-local-storage.service';
import { ConversationService } from '../conversations.service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
    idSession: string;
    conversations: {name: string, time: string, latestMassege: string, id: number}[] = [];

    constructor(private conversazioniService: ConversationService,
                private authService: AuthLocalStorage,
                private router: Router) { }

    ngOnInit(): void {
        this.conversations = this.conversazioniService.conversations;
        this.idSession = JSON.parse(localStorage.getItem("sessione")).id.toString();
    }


    onLogout(){
        this.authService.logout();
        this.router.navigate(['']);
    }
}

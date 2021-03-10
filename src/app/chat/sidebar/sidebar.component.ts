import { Component, OnInit } from '@angular/core';
import { ConversationService } from '../conversations.service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
    conversations: {name: string, time: string, latestMassege: string, id: number}[] = [];

    constructor(private conversazioniService: ConversationService) { }

    ngOnInit(): void {
        this.conversations = this.conversazioniService.conversations;
    }

}

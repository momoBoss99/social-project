import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ChatContentComponent } from "./chat-content/chat-content.component";
import { SidebarComponent } from "./sidebar/sidebar.component";
import { ChatComponent } from './chat.component';
import { ChatRoutingModule } from "./chat-routing.module";
import { MainModule } from "../main/main.module";

@NgModule({
    declarations: [
        ChatContentComponent,
        SidebarComponent,
        ChatComponent
    ],
    imports: [
        RouterModule,
        CommonModule,
        HttpClientModule,
        ChatRoutingModule,
        MainModule
    ],
    exports: [
        ChatComponent
    ]
})
export class ChatModule {}
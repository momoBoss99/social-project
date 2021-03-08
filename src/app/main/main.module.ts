import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { HeaderComponent } from "./header/header.component";
import { HomepageComponent } from './homepage/homepage.component';
import { MainRoutingModule } from "./main-routing.module";
import { MainComponent } from "./main.component";
import { ProfilePageComponent } from './profile-page/profile-page.component';
import { SearchProfilesComponent } from './search-profiles/search-profiles.component';
import { DetailPostComponent } from './profile-page/detail-post/detail-post.component';
import { DetailFullComponent } from "./profile-page/detail-full/detail-full.component";
import { PostCardComponent } from "./post-card/post-card.component";
import { AddPostComponent } from "./add-post/add-post.component";
import { UpdateProfileComponent } from "./profile-page/update-profile/update-profile.component";

@NgModule({
    declarations: [
        MainComponent,
        HeaderComponent,
        HomepageComponent,
        ProfilePageComponent,
        SearchProfilesComponent,
        DetailPostComponent,
        DetailFullComponent,
        PostCardComponent,
        AddPostComponent,
        UpdateProfileComponent
    ],
    imports: [
        RouterModule,
        CommonModule,
        HttpClientModule,
        FormsModule,
        MainRoutingModule,
    ],
    exports: [
        MainComponent
    ]
})
export class MainModule {}
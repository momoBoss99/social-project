import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "../auth/auth.guard";
import { AddPostComponent } from "./add-post/add-post.component";
import { HomepageComponent } from "./homepage/homepage.component";
import { MainComponent } from "./main.component";
import { DetailFullComponent } from "./profile-page/detail-full/detail-full.component";
import { ProfilePageComponent } from "./profile-page/profile-page.component";
import { UpdateProfileComponent } from "./profile-page/update-profile/update-profile.component";
import { ProfilesListViewComponent } from "./profiles-list-view/profiles-list-view.component";
import { SearchProfilesComponent } from "./search-profiles/search-profiles.component";

const routes: Routes = [
    { path: '', component: MainComponent,
            //canActivate: [AuthGuard],
            children: [
        { path: '', component: HomepageComponent},
        { path: ':id', component: ProfilePageComponent},
        { path: 'list/likes/:idpost', component: ProfilesListViewComponent},
        { path: 'list/followers/:idprofile', component: ProfilesListViewComponent},
        { path: 'list/follows/:idprofiles', component: ProfilesListViewComponent},
        { path: 'edit/post', component: AddPostComponent},
        { path: 'edit/profile', component: UpdateProfileComponent},
        { path: 'search/:name', component: SearchProfilesComponent},
        { path: 'posts/:id', component: DetailFullComponent},
        /**
         * aggiungere gli altri path
         */
    ]}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MainRoutingModule {}
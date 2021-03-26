import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const appRoutes: Routes = [
  {
    path: '',
    loadChildren: () => import('./main/main.module').then((m) => m.MainModule),
  },
  /*{
    path: 'profiles',
    loadChildren: () =>
        import('./main/main.module').then((m) => m.MainModule),
  },*/
  {
    path: 'auth',
    loadChildren: () => 
        import('./auth/auth.module').then((m) => m.AuthModule)
  },
  {
    path: 'chat',
    loadChildren: () => 
        import('./chat/chat.module').then((m) => m.ChatModule),
  },
  { path: '**',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}

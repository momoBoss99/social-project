import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const appRoutes: Routes = [
  {
    path: '',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'profiles',
    loadChildren: () =>
        import('./main/main.module').then((m) => m.MainModule),
  },
  { path: '**',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule)
  } //url not found route
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}

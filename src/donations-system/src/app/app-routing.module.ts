import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SignUpPageComponent } from './pages/external/sign-up-page/sign-up-page.component';
import { LoginPageComponent } from './pages/external/login-page/login-page.component';
import { HomePageComponent } from './pages/internal/home-page/home-page.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginPageComponent
  },
  {
    path: 'cadastro',
    component: SignUpPageComponent
  },
  {
    path: 'home',
    component: HomePageComponent
  },
  {
    path: '**',
    redirectTo: 'login'
  }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

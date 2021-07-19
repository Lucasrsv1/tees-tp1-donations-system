import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

<<<<<<< HEAD
import { SignUpPageComponent } from './pages/external/sign-up-page/sign-up-page.component';
import { LoginPageComponent } from './pages/external/login-page/login-page.component';
import { HomePageComponent } from './pages/internal/home-page/home-page.component';
import { RegisterDonationComponent } from './pages/external/register-donation-page/register-donation-page.component'

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
    path: 'cadastrar-doacao',
    component: RegisterDonationComponent
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
=======
import { AuthenticationGuard } from "./guards/authentication/authentication.guard";
import { LoginGuard } from "./guards/login/login.guard";

import { LoginPageComponent } from "./pages/external/login-page/login-page.component";
import { SignUpPageComponent } from "./pages/external/sign-up-page/sign-up-page.component";
import { HomePageComponent } from "./pages/internal/home-page/home-page.component";

const routes: Routes = [
	{
		path: "login",
		component: LoginPageComponent,
		canActivate: [LoginGuard]
	},
	{
		path: "signUp",
		component: SignUpPageComponent,
		canActivate: [LoginGuard]
	},
	{
		path: "home",
		component: HomePageComponent,
		canActivate: [AuthenticationGuard]
	},
	{
		path: "**",
		redirectTo: "login"
	}
];
>>>>>>> 6c63d3931be14a45ca844d88afc2320c276f3b56

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }

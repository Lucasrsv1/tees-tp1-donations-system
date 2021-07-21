import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { AuthenticationGuard } from "./guards/authentication/authentication.guard";
import { LoginGuard } from "./guards/login/login.guard";

import { LoginPageComponent } from "./pages/external/login-page/login-page.component";
import { SignUpPageComponent } from "./pages/external/sign-up-page/sign-up-page.component";
import { HomePageComponent } from "./pages/internal/home-page/home-page.component";
import { RegisterDonationComponent } from './pages/external/register-donation-page/register-donation-page.component'

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
		path: 'cadastrar-doacao',
		component: RegisterDonationComponent
	},
	{
		path: "**",
		redirectTo: "login"
	}
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }

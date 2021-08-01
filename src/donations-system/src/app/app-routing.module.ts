import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { AuthenticationGuard } from "./guards/authentication/authentication.guard";
import { LoginGuard } from "./guards/login/login.guard";

import { LoginPageComponent } from "./pages/external/login-page/login-page.component";
import { SignUpPageComponent } from "./pages/external/sign-up-page/sign-up-page.component";
import { DonationPageComponent } from "./pages/internal/donation-page/donation-page.component";
import { DonationsManagementPageComponent } from "./pages/internal/donations-management-page/donations-management-page.component";
import { DonationsValidationPageComponent } from "./pages/internal/donations-validation-page/donations-validation-page.component";
import { HomePageComponent } from "./pages/internal/home-page/home-page.component";
import { ItemsTypeManagementPageComponent } from "./pages/internal/items-type-management-page/items-type-management-page.component";

const routes: Routes = [
	{ path: "login", component: LoginPageComponent, canActivate: [LoginGuard] },
	{ path: "signUp", component: SignUpPageComponent, canActivate: [LoginGuard] },
	{ path: "home", component: HomePageComponent, canActivate: [AuthenticationGuard] },
	{ path: "itemTypesManagement", component: ItemsTypeManagementPageComponent, canActivate: [AuthenticationGuard] },
	{ path: "donationsManagement", component: DonationsManagementPageComponent, canActivate: [AuthenticationGuard] },
	{ path: "donationsValidation", component: DonationsValidationPageComponent, canActivate: [AuthenticationGuard] },
	{ path: "donation", component: DonationPageComponent, canActivate: [AuthenticationGuard] },
	{ path: "**", redirectTo: "login" }
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }

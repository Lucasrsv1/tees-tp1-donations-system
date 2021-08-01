import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { SweetAlert2Module } from "@sweetalert2/ngx-sweetalert2";
import { DataTablesModule } from "angular-datatables";
import { BlockUIModule } from "ng-block-ui";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { CarouselModule } from "ngx-bootstrap/carousel";
import { ModalModule } from "ngx-bootstrap/modal";

import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { ComponentsModule } from "./components/components.module";

import { LoginPageComponent } from "./pages/external/login-page/login-page.component";
import { SignUpPageComponent } from "./pages/external/sign-up-page/sign-up-page.component";
import { HomePageComponent } from "./pages/internal/home-page/home-page.component";
import { ItemsTypeManagementPageComponent } from "./pages/internal/items-type-management-page/items-type-management-page.component";

import { DonationPageComponent } from "./pages/internal/donation-page/donation-page.component";
import { DonationsManagementPageComponent } from "./pages/internal/donations-management-page/donations-management-page.component";
import { DonationsValidationPageComponent } from "./pages/internal/donations-validation-page/donations-validation-page.component";
import { RequestInterceptor } from "./services/authentication/request.interceptor";

@NgModule({
	declarations: [
		AppComponent,
		LoginPageComponent,
		SignUpPageComponent,
		ItemsTypeManagementPageComponent,
		HomePageComponent,
		DonationsValidationPageComponent,
		DonationsManagementPageComponent,
		DonationPageComponent
	],
	imports: [
		BrowserModule,
		HttpClientModule,
		FormsModule,
		ReactiveFormsModule,
		MatButtonModule,
		MatFormFieldModule,
		MatInputModule,
		MatSelectModule,
		MatSlideToggleModule,
		BrowserAnimationsModule,
		FontAwesomeModule,
		ModalModule.forRoot(),
		CarouselModule.forRoot(),
		BlockUIModule.forRoot(),
		SweetAlert2Module.forRoot(),
		NgMultiSelectDropDownModule.forRoot(),
		DataTablesModule,
		AppRoutingModule,
		ComponentsModule,
		FontAwesomeModule
	],
	providers: [
		{ provide: HTTP_INTERCEPTORS, useClass: RequestInterceptor, multi: true }
	],
	bootstrap: [AppComponent]
})
export class AppModule { }

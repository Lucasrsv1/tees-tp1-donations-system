import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { SweetAlert2Module } from "@sweetalert2/ngx-sweetalert2";

import { BlockUIModule } from "ng-block-ui";

import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";

import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";

import { LoginPageComponent } from "./pages/external/login-page/login-page.component";
import { SignUpPageComponent } from "./pages/external/sign-up-page/sign-up-page.component";
import { HomePageComponent } from "./pages/internal/home-page/home-page.component";
import { ItemsTypeManagementPageComponent } from "./pages/internal/items-type-management-page/items-type-management-page.component";

import { RequestInterceptor } from "./services/authentication/request.interceptor";

@NgModule({
	declarations: [
		AppComponent,
		LoginPageComponent,
		SignUpPageComponent,
		ItemsTypeManagementPageComponent,
		HomePageComponent
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		HttpClientModule,
		FormsModule,
		ReactiveFormsModule,
		MatFormFieldModule,
		MatInputModule,
		MatSelectModule,
		MatSlideToggleModule,
		BrowserAnimationsModule,
		BlockUIModule.forRoot(),
		SweetAlert2Module.forRoot()
	],
	providers: [
		{ provide: HTTP_INTERCEPTORS, useClass: RequestInterceptor, multi: true }
	],
	bootstrap: [AppComponent]
})
export class AppModule { }

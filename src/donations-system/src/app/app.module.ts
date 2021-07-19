import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { LoginPageComponent } from './pages/external/login-page/login-page.component';
import { SignUpPageComponent } from './pages/external/sign-up-page/sign-up-page.component';
import { ItemsTypeManagementPageComponent } from './pages/internal/items-type-management-page/items-type-management-page.component';
import { HomePageComponent } from './pages/internal/home-page/home-page.component';
import { RegisterDonationComponent } from './pages/external/register-donation-page/register-donation-page.component';

import { AuthenticationService } from './services/auth/authentication.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    SignUpPageComponent,
    ItemsTypeManagementPageComponent,
    HomePageComponent,
    RegisterDonationComponent
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
    BrowserAnimationsModule
  ],
  providers: [
    AuthenticationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

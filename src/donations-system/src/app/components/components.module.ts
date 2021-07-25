import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";

import { DonationComponent } from "./donation/donation.component";
import { HeaderComponent } from './header/header.component';

@NgModule({
	declarations: [DonationComponent, HeaderComponent],
	imports: [
		BrowserModule,
		RouterModule,
		FontAwesomeModule
	],
	exports: [DonationComponent, HeaderComponent]
})
export class ComponentsModule { }

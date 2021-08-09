import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { CarouselModule } from "ngx-bootstrap/carousel";

import { DonationComponent } from "./donation/donation.component";
import { FileUploadComponent } from "./file-upload/file-upload.component";
import { HeaderComponent } from "./header/header.component";

@NgModule({
	declarations: [
		DonationComponent,
		HeaderComponent,
		FileUploadComponent
	],
	imports: [
		BrowserModule,
		RouterModule,
		CarouselModule,
		FontAwesomeModule
	],
	exports: [
		DonationComponent,
		HeaderComponent,
		FileUploadComponent
	]
})
export class ComponentsModule { }

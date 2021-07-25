import { ComponentFixture, TestBed } from "@angular/core/testing";

import { DonationsValidationPageComponent } from "./donations-validation-page.component";

describe("DonationsValidationPageComponent", () => {
	let component: DonationsValidationPageComponent;
	let fixture: ComponentFixture<DonationsValidationPageComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [DonationsValidationPageComponent]
		})
			.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(DonationsValidationPageComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});

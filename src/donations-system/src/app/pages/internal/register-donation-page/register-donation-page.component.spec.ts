import { ComponentFixture, TestBed } from "@angular/core/testing";

import { RegisterDonationComponent } from "./register-donation-page.component";

describe("RegisterDonationComponent", () => {
	let component: RegisterDonationComponent;
	let fixture: ComponentFixture<RegisterDonationComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [RegisterDonationComponent]
		})
			.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(RegisterDonationComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});

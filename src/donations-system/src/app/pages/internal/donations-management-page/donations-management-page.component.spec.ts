import { ComponentFixture, TestBed } from "@angular/core/testing";

import { DonationsManagementPageComponent } from "./donations-management-page.component";

describe("DonationsManagementPageComponent", () => {
	let component: DonationsManagementPageComponent;
	let fixture: ComponentFixture<DonationsManagementPageComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [DonationsManagementPageComponent]
		})
			.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(DonationsManagementPageComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});

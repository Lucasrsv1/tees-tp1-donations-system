import { TestBed } from "@angular/core/testing";

import { DonationsManagementService } from "./donations-management.service";

describe("DonationsManagementService", () => {
	let service: DonationsManagementService;

	beforeEach(() => {
		TestBed.configureTestingModule({ });
		service = TestBed.inject(DonationsManagementService);
	});

	it("should be created", () => {
		expect(service).toBeTruthy();
	});
});

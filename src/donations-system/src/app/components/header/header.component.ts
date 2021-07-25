import { Component } from '@angular/core';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

import { AuthenticationService } from 'src/app/services/authentication/authentication.service';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
	public faSignOutAlt = faSignOutAlt;

	constructor (private authenticationService: AuthenticationService) { }

	public logout (): void {
		this.authenticationService.signOut();
	}

	public get isSystemAdmin (): boolean {
		return this.authenticationService.isSystemAdmin();
	}
}

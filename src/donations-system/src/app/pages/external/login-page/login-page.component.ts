import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/services/auth/authentication.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent {

  form: FormGroup;

  constructor(private authenticationService : AuthenticationService, private readonly formBuilder: FormBuilder) { 
    this.form = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.minLength(6)]]
    });
  }

  signUp(): void { 
    this.authenticationService.signUp(this.form.controls.email.value, this.form.controls.password.value)
      .subscribe((res) => {
        
      }, (error) => {

      }); 
  }

  cancel(): void { }

}

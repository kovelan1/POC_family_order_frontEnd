import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ApiManagerService} from '../../_services/api-manager.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NgxSpinnerService} from 'ngx-spinner';
import {AlertService} from '../../_alert';
import {Router} from '@angular/router';
import {MustMatch} from '../../_services/must-match';
import {RegistrationRequestBody} from '../../_models/RegistrationRequestBody';
import {TranslateService} from '@ngx-translate/core';
import {LoggerService} from 'src/app/shared/logger.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html'
})
export class SignupComponent implements OnInit, AfterViewInit {
  options = {
    autoClose: true,
    keepAfterRouteChange: false
  };

  registerForm: FormGroup;
  submitted = false;

  signupFormShow = false;
  allCustomers: any;

  constructor(private apiManagerService: ApiManagerService,
              private formBuilder: FormBuilder,
              private spinner: NgxSpinnerService,
              private alertService: AlertService,
              private router: Router,
              private registrationRequestBody: RegistrationRequestBody,
              public translate: TranslateService,
              private loggerService: LoggerService) {
    translate.addLangs(['us', 'fr']);
    translate.setDefaultLang(localStorage.getItem('selected_lang'));
  }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      name: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],
      fid: ['', Validators.required],
      mid: ['', Validators.required],
      type: ['2'],
      role: ['customer']
    });

    if (localStorage.getItem('user_token')) {
      this.router.navigate(['dashboard/home']);
    }
  }

  ngAfterViewInit() {
    this.getAllCustomers();
  }

  get fields() {
    return this.registerForm.controls;
  }

  public doRegistration(): void {
    this.spinner.show();
    this.submitted = true;
    if (this.registerForm.invalid) {
      this.spinner.hide();
      this.loggerService.log('registerForm', this.registerForm);
      return;
    }

    this.registrationRequestBody = this.registerForm.getRawValue();
    this.registrationRequestBody.user_type = 2;
    this.registrationRequestBody.role = ['subscriber'];
    this.loggerService.log('registrationRequestBody', this.registrationRequestBody);

    this.apiManagerService.registration(this.registrationRequestBody).subscribe((response: any) => {
        this.spinner.hide();
        this.loggerService.log('response', response);
        this.router.navigate(['authentication/login']);
      },
      error => {
        this.spinner.hide();
        this.loggerService.log('error', error);
        this.alertService.error(error.error.message, {autoClose: true});
      });
  }

  hideSignupForm() {
    this.signupFormShow = !this.signupFormShow;
  }

  getAllCustomers() {
    this.apiManagerService.getAllCustomers().subscribe((response: any) => {
        this.allCustomers = response;
        console.log(this.allCustomers);
      },
      error => {
        this.spinner.hide();
        this.loggerService.log('error', error);
        this.alertService.error(error.error.message, {autoClose: true});
      });
  }

  showSignupForm() {
    this.signupFormShow = !this.signupFormShow;
  }
}

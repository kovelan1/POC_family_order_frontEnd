import {Component, OnInit} from '@angular/core';
import {NgxSpinnerService} from 'ngx-spinner';
import {TranslateService} from '@ngx-translate/core';
import {ApiManagerService} from '../_services/api-manager.service';
import {UserInfoBody} from '../_models/UserInfoBody';
import {AlertService} from '../_alert';
import { LoggerService } from 'src/app/shared/logger.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  options = {
    autoClose: true,
    keepAfterRouteChange: false
  };

  constructor(private apiManagerService: ApiManagerService,
              private spinner: NgxSpinnerService,
              private alertService: AlertService,
              public userInfoBody: UserInfoBody,
              public translate: TranslateService,
              private loggerService: LoggerService) {
    translate.addLangs(['us', 'fr']);
    translate.setDefaultLang(localStorage.getItem('selected_lang'));
  }

  ngOnInit() {
    this.getProfile();
  }

  public doUpdate(first_name, last_name, business, cif, phone, address, zip_code, city): void {
    if (first_name === '' || last_name === '' || phone === '' || address === ''  || zip_code === '' || city === '') {
      this.alertService.warn('Veuillez remplir les champs obligatoires.');
      return;
    }

    this.spinner.show();

    this.userInfoBody.first_name = first_name;
    this.userInfoBody.last_name = last_name;
    this.userInfoBody.business = business;
    this.userInfoBody.cif = cif;
    this.userInfoBody.phone = phone;
    this.userInfoBody.address = address;
    this.userInfoBody.postal_code = zip_code;
    this.userInfoBody.city = city;

    this.loggerService.log('userInfoBody', this.userInfoBody);

    this.apiManagerService.update(this.userInfoBody).subscribe((response: any) => {
        this.spinner.hide();
        this.loggerService.log('response', response);
        this.alertService.success(response.message, {autoClose: true});
      },
      error => {
        this.spinner.hide();
        this.loggerService.log('error', error);
        this.alertService.error(error.error.message, {autoClose: true});
      });
  }

  public getProfile(): void {
    this.spinner.show();
    this.apiManagerService.getProfile().subscribe((response: any) => {
        this.spinner.hide();
        this.userInfoBody = response;
        this.loggerService.log('response', response);
      },
      error => {
        this.spinner.hide();
        this.loggerService.log('error', error);
        this.alertService.error(error.error.message, {autoClose: true});
      });
  }

  updatePassword(old_password, new_password, confirm_password) {
    const passwords = {
      'old_password': old_password,
      'new_password': new_password,
    };

    if (new_password === confirm_password) {
      this.apiManagerService.updatePassword(passwords).subscribe((response: any) => {
          this.spinner.hide();
          this.alertService.success(response.message, {autoClose: true});
        },
        error => {
          this.spinner.hide();
          this.loggerService.log('error', error);
          this.alertService.error(error.error.message, {autoClose: true});
        });
    } else {
      this.alertService.error('pass_not_matched');
    }

  }
}

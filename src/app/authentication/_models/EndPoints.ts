import {environment} from '../../../environments/environment';

export class EndPoints {
  private baseUrl = environment.base_url;

  public readonly subscriber_login = this.baseUrl + 'api/auth/signin';
  public readonly reset_pass_link = this.baseUrl + 'api/auth/reset';
  public readonly update_password = this.baseUrl + 'api/auth/reset-password';
  public readonly subscriber_registration = this.baseUrl + 'api/auth/signup';
  public readonly get_all_customers = this.baseUrl + 'api/auth/get/all/customers';
}

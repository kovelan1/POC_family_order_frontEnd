import {environment} from '../../environments/environment';

export class CommonEndPoints {
  private baseUrl = environment.base_url;
  public readonly availableBalance = this.baseUrl + 'api/report/dashboard/available-balance';
}

import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {EndPoints} from '../_models/EndPoints';
import {catchError} from 'rxjs/operators';
import {throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiManagerService {

  constructor(private http: HttpClient, private endpoints: EndPoints) {
  }

  public checkCredentials(loginParam): any {
    return this.http.post(this.endpoints.subscriber_login, loginParam).pipe(
      catchError(this.handleError),
    );
  }

  public sendPassResetLink(email) {
    return this.http.post(this.endpoints.reset_pass_link, email).pipe(
      catchError(this.handleError),
    );
  }

  public registration(registrationData): any {
    return this.http.post(this.endpoints.subscriber_registration, registrationData).pipe(
      catchError(this.handleError),
    );
  }

  public updatePassword(passwords): any {
    return this.http.post(this.endpoints.update_password, passwords).pipe(
      catchError(this.handleError),
    );
  }

  public getAllCustomers(): any {
    return this.http.get(this.endpoints.get_all_customers).pipe(
      catchError(this.handleError),
    );
  }

  public getAllRegions(): any {
    return this.http.get(this.endpoints.get_all_regions).pipe(
      catchError(this.handleError),
    );
  }

  private handleError(error: HttpErrorResponse): any {
    return throwError(error);
  }

}

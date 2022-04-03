import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EndPoints } from '../_models/EndPoints';
import {catchError} from 'rxjs/operators';
import {throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiManagerService {

  constructor(private http: HttpClient, private endpoints: EndPoints) { }

  public addAdmin(data):any{
    return this.http.post(this.endpoints.update_password, data).pipe(
      catchError(this.handleError),
    );
  }

  public getRegions(data):any{
    return this.http.post(this.endpoints.getRegions, data).pipe(
      catchError(this.handleError),
    );
  }

  private handleError(error: HttpErrorResponse): any {
    return throwError(error);
  }
}

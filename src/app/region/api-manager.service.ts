import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError} from 'rxjs/operators';
import {throwError} from 'rxjs';
import {EndPoints} from "../shared/EndPoints";

@Injectable({
  providedIn: 'root'
})
export class ApiManagerService {
  constructor(private http: HttpClient,
              private endpoints: EndPoints) {
  }

  public create(body): any {
    return this.http.post(this.endpoints.createReg, body).pipe(
      catchError(this.handleError),
    );
  }

  public update(body, id): any {
    return this.http.put(this.endpoints.updateReg + id, body).pipe(
      catchError(this.handleError),
    );
  }

  public get(): any {
    return this.http.get(this.endpoints.getReg).pipe(
      catchError(this.handleError),
    );
  }

  // public delete(id): any {
  //   return this.http.get(this.endpoints.getSpecificCat + id).pipe(
  //     catchError(this.handleError),
  //   );
  // }


  private handleError(error: HttpErrorResponse): any {
    return throwError(error);
  }
}

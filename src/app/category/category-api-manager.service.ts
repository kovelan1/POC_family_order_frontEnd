import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError} from 'rxjs/operators';
import {throwError} from 'rxjs';
import {EndPoints} from "../shared/EndPoints";

@Injectable({
  providedIn: 'root'
})
export class CategoryApiManagerService {
  constructor(private http: HttpClient, private endpoints: EndPoints) {
  }

  public createCategory(body): any {
    return this.http.post(this.endpoints.createCat, body).pipe(
      catchError(this.handleError),
    );
  }

  public updateCategory(body, id): any {
    return this.http.put(this.endpoints.updateCat + id, body).pipe(
      catchError(this.handleError),
    );
  }

  public getParentCategory(): any {
    return this.http.get(this.endpoints.getParent).pipe(
      catchError(this.handleError),
    );
  }

  public getCatById(id): any {
    return this.http.get(this.endpoints.getSpecificCat + id).pipe(
      catchError(this.handleError),
    );
  }


  private handleError(error: HttpErrorResponse): any {
    return throwError(error);
  }
}

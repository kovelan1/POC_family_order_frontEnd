import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {EndPoints} from '../shared/EndPoints';

@Injectable({
    providedIn: 'root'
})
export class ApiManagerService {

    constructor(private http: HttpClient,
                private endpoints: EndPoints) {
    }

    public create(body): any {
        return this.http.post(this.endpoints.createProduct, body).pipe(
            catchError(this.handleError),
        );
    }

    public update(body, id): any {
        return this.http.put(this.endpoints.updateProduct + id, body).pipe(
            catchError(this.handleError),
        );
    }

    public getParentCategories(): any {
        return this.http.get(this.endpoints.getParent).pipe(
            catchError(this.handleError),
        );
    }

    public getAll(): any {
        return this.http.get(this.endpoints.getProducts).pipe(
            catchError(this.handleError),
        );
    }

    public getById(id): any {
        return this.http.get(this.endpoints.getProductById + id).pipe(
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

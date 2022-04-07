import {AfterViewInit, Component, OnInit} from '@angular/core';
import {CategoryApiManagerService} from '../category-api-manager.service';
import {LoggerService} from '../../shared/logger.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {HttpClient} from '@angular/common/http';

import {AlertService} from '../_alert';
import {EndPoints} from '../../shared/EndPoints';

class DataTablesResponse {
    data: any[];
    draw: number;
    recordsFiltered: number;
    recordsTotal: number;
}

@Component({
    selector: 'app-manage-category',
    templateUrl: './manage-category.component.html',
    styleUrls: ['./manage-category.component.css']
})
export class ManageCategoryComponent implements OnInit, AfterViewInit {
    dtOptions: DataTables.Settings = {};
    categories: any;
    parentCategories: any;
    category: any;
    updateContainer: string;

    constructor(private apiService: CategoryApiManagerService,
                private loggerService: LoggerService,
                private spinner: NgxSpinnerService,
                private http: HttpClient,
                private endpoints: EndPoints,
                private alertService: AlertService) {
    }

    ngOnInit(): void {
        this.updateContainer = 'hidden';
        this.getParentCategory();
        const that = this;

        this.dtOptions = {
            pagingType: 'simple_numbers',
            pageLength: 2,
            serverSide: true,
            processing: true,
            ajax: (dataTablesParameters: any, callback) => {
                that.http.post<DataTablesResponse>(this.endpoints.getAllCat,
                    dataTablesParameters, {}
                ).subscribe(resp => {
                    that.categories = resp.data;
                    callback({
                        recordsTotal: resp.recordsTotal,
                        recordsFiltered: resp.recordsFiltered,
                        data: []
                    });
                });
            },
            searching: false,
            columns: [
                {data: 'id'},
                {data: 'name'},
                {data: 'childCategory'}
            ]
        };
    }

    createCategory(name: string, parentCat: string) {
        this.spinner.show();
        const data = {
            'name': name,
            'parentID': parentCat
        };
        this.apiService.createCategory(data).subscribe((response: any) => {
                this.spinner.hide();
                console.log(response);
                this.alertService.success('Category Created Successfully');
            },
            error => {
                this.spinner.hide();
                this.loggerService.log('error', error);
            }
        );
    }

    getParentCategory() {
        this.spinner.show();
        this.apiService.getParentCategory().subscribe((response: any) => {
                this.spinner.hide();
                this.parentCategories = response;
                console.log(this.categories);
            },
            error => {
                this.spinner.hide();
                this.loggerService.log('error', error);
            }
        );
    }

    ngAfterViewInit(): void {

    }

    getData(id: any) {
        this.spinner.show();
        this.apiService.getCatById(id).subscribe((response: any) => {
                this.spinner.hide();
                this.updateContainer = 'show';
                this.category = response;
                console.log(response);
            },
            error => {
                this.spinner.hide();
                this.loggerService.log('error', error);
            }
        );
        console.log(id);
    }

    updateCategory(name: string, parentID: string, id: string) {
        const data = {
            'name': name,
            'parentID': parentID
        };
        this.apiService.updateCategory(data, id).subscribe((response: any) => {
                this.spinner.hide();
                this.updateContainer = 'hidden';
                this.category = null;
                console.log(this.updateContainer);
                console.log(response);
            },
            error => {
                this.spinner.hide();
                console.log(error);
            }
        );
    }
}

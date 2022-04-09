import {HttpClient} from '@angular/common/http';
import {Component, OnInit, ViewChild} from '@angular/core';
import {NgxSpinnerService} from 'ngx-spinner';
import {AlertService} from '../../dashboards/_alert';
import {EndPoints} from 'src/app/shared/EndPoints';
import {LoggerService} from 'src/app/shared/logger.service';
import {ApiManagerService} from '../api-manager.service';
import {DataTableDirective} from 'angular-datatables';
import {Subject} from 'rxjs';

class DataTablesResponse {
    data: any[];
    draw: number;
    recordsFiltered: number;
    recordsTotal: number;
}

@Component({
    selector: 'app-product-component',
    templateUrl: './product-component.component.html',
    styleUrls: ['./product-component.component.css']
})

export class ProductComponentComponent implements OnInit {
    @ViewChild(DataTableDirective, {static: false})
    dtElement: DataTableDirective;
    dtOptions: DataTables.Settings = {};
    dtTrigger: Subject<any> = new Subject();
    products: any;
    parentCategories: any;
    subCategories: any;
    category: any [];
    product: any;
    updateContainer: string;

    constructor(
        private apiService: ApiManagerService,
        private loggerService: LoggerService,
        private spinner: NgxSpinnerService,
        private http: HttpClient,
        private endpoints: EndPoints,
        private alertService: AlertService
    ) {
    }

    ngOnInit(): void {

        this.updateContainer = 'hidden';
        this.getAllParentCategories();
        const that = this;
        this.alertService.success('Category Created Successfully');
        this.loadDatatables();
    }


    createProduct(name: string, price: number, categoryID: number) {
        console.log(categoryID);
        
        this.spinner.show();
        const data = {
            'name': name,
            'price': price,
            'catID': categoryID
        };
        this.apiService.create(data).subscribe((response: any) => {
                this.spinner.hide();
                console.log(response);
                this.alertService.success('Product Created Successfully');
                this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                    // Destroy the table first
                    dtInstance.destroy();
                    // Call the dtTrigger to rerender again
                    this.loadDatatables();
                    setTimeout(() => {
                        this.dtTrigger.next();
                        this.spinner.hide();
                    }, 500);
                });
            },
            error => {
                this.spinner.hide();
                this.loggerService.log('error', error);
                this.alertService.error('Something went wrong');
            }
        );
    }

    updateProduct(productId: any, name: string, price: string, categoryID: string) {
        console.log('ProdcutId' + productId);

        this.spinner.show();
        const data = {
            'name': name,
            'price': price,
            'catID': categoryID
        };
        this.apiService.update(data, productId).subscribe((response: any) => {
                this.spinner.hide();
                console.log(response);
                this.alertService.success('Product Updated Successfully');
            },
            error => {
                this.spinner.hide();
                this.loggerService.log('error', error);
                this.alertService.error('Something went wrong');
            }
        );
    }

    getData(prod: any) {
        this.spinner.show();
        this.spinner.hide();
        this.updateContainer = 'show';
        this.product = prod;
        console.log(prod);
    }

    getProductById(id: any) {
        this.spinner.show();
        this.apiService.getById(id).subscribe((response: any) => {
                console.log(response);
                this.product = response;
                if (this.product.parent_cat != null) {
                    this.category = this.product.parent_cat.childCategory;
                } else {
                    this.category.push(this.product.product_details.category);
                }
            },
            error => {
                this.spinner.hide();
                this.loggerService.log('error', error);
            }
        );
        this.spinner.hide();
    }

    getAllParentCategories() {
        this.spinner.show();
        this.apiService.getParentCategories().subscribe((response: any) => {
                console.log(response);
                this.parentCategories = response;
            },
            error => {
                this.spinner.hide();
                this.loggerService.log('error', error);
            }
        );
        this.spinner.hide();
    }

    getSubcatByParent(catId: any) {
        console.log('comming.....');
        console.log(catId);

        const filterResult = this.parentCategories.filter(cate => {
            return cate.id == catId;
        });

        this.category = filterResult[0].childCategory;
    }

    addProduct() {

    }

    private loadDatatables() {
        const that = this;
        this.dtOptions = {
            pagingType: 'simple_numbers',
            pageLength: 10,
            serverSide: true,
            processing: true,
            ajax: (dataTablesParameters: any, callback) => {
                that.http.post<DataTablesResponse>(this.endpoints.getProducts,
                    dataTablesParameters, {}
                ).subscribe(resp => {
                    that.products = resp.data;
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
                {data: 'price'},
                {data: 'category'}
            ]
        };
    }
}


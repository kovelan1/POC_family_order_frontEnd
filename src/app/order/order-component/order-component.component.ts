import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {NgxSpinnerService} from 'ngx-spinner';
import {AlertService} from '../../dashboards/_alert';
import {EndPoints} from 'src/app/shared/EndPoints';
import {LoggerService} from 'src/app/shared/logger.service';
import {ApiManagerService} from '../api-manager.service';
import {FormGroup, FormControl, FormArray, FormBuilder} from '@angular/forms';
import {DataTableDirective} from 'angular-datatables';
import {Subject} from 'rxjs';

class DataTablesResponse {
    data: any[];
    draw: number;
    recordsFiltered: number;
    recordsTotal: number;
}

@Component({
    selector: 'app-order-component',
    templateUrl: './order-component.component.html',
    styleUrls: ['./order-component.component.css']
})


export class OrderComponentComponent implements OnInit, AfterViewInit {
    @ViewChild(DataTableDirective, {static: false})
    dtElement: DataTableDirective;
    dtOptions: DataTables.Settings = {};
    dtTrigger: Subject<any> = new Subject();

    products: any;
    regions: any;
    orders: any;
    productCount: number;
    productTotal: number;
    category: {
        id: any;
        name: any;
        childCategory: any[];
    };
    selectedProduct: any[];
    product: any;
    updateContainer: string;
    productForm: FormGroup;
    productForm_update:FormGroup;
    selectedOrder:any;

    constructor(
        private apiService: ApiManagerService,
        private loggerService: LoggerService,
        private spinner: NgxSpinnerService,
        private http: HttpClient,
        private endpoints: EndPoints,
        private alertService: AlertService,
        private fb: FormBuilder,
        private fb_u: FormBuilder
    ) {
        this.productForm = this.fb.group({
            selectedProducts: this.fb.array([]),
        });

        this.productForm_update=this.fb_u.group({
            selectedProducts_u: this.fb_u.array([]),
        });


    }

    ngOnInit(): void {
        
        this.addProduct();
        this.getAllProducts();
        this.getAllRegions();
        this.updateContainer = 'hidden';
        this.loadDatatables('r_id=1');
    }

    ngAfterViewInit(): void {
        this.dtTrigger.next();
    }

    loadDatatables(param) {
        const that = this;

        this.dtOptions = {
            pagingType: 'simple_numbers',
            pageLength: 1,
            serverSide: true,
            processing: true,
            ajax: (dataTablesss: any, callback) => {
                that.http.post<DataTablesResponse>(this.endpoints.getOrders + '?' + param, dataTablesss, {}
                ).subscribe(resp => {
                    that.orders = resp.data;
                    console.log(resp.data);
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
                {data: 'total'},
                {data: 'region'},
                {data: 'order_date'},
                {data: 'orderedProducts'},
            ]
        };
    }

    createOrder() {
        this.spinner.show();
        const data = {
            'products': this.productForm.value.selectedProducts,
            'order_date': new Date(),
            'total': this.getTotalAmount(),
            'rid': localStorage.getItem('region_id'),
            'uid': localStorage.getItem('user_id'),
        };
        this.apiService.create(data).subscribe((response: any) => {
                this.spinner.hide();

                this.alertService.success('POrder Placed Successfully');
            },
            error => {
                this.spinner.hide();
                this.loggerService.log('error', error);
                this.alertService.error('Something went wrong');
            }
        );
    }

    updateOrder(id:any){

        this.spinner.show();
        const data = {
            'products': this.productForm_update.value.selectedProducts_u,
            'total': this.getTotalAmount_u(),
            'rid': localStorage.getItem('region_id'),
            'uid': localStorage.getItem('user_id'),
        };
        this.apiService.update(id,data).subscribe((response: any) => {
                this.spinner.hide();

                this.alertService.success('Order Updated Successfully');
            },
            error => {
                this.spinner.hide();
                this.loggerService.log('error', error);
                this.alertService.error('Something went wrong');
            }
        );
    }

    getAllProducts() {
        this.apiService.getAllNoPage().subscribe((response: any) => {
            this.products = response;
        });
    }

    getAllRegions() {
        this.apiService.getAllRegion().subscribe((response: any) => {
            this.regions = response;
        });
    }


    setProductTotal(produc: any, i: number) {
        console.log(i);
        const filterResult = this.products.filter(prod => {
            return prod.id == produc.value.product_id;
        });

        this.selectedProducts().value[i].price = filterResult[0].price * produc.value.qty;
    }

    setProductTotal_u(produc: any, i: number) {
        console.log(i);
        const filterResult = this.products.filter(prod => {
            return prod.id == produc.value.product_id;
        });

        this.selectedProducts_u().value[i].price = filterResult[0].price * produc.value.qty;
    }

    // related to product list and add products and quty##########################

    selectedProducts(): FormArray {
        return this.productForm.get('selectedProducts') as FormArray;
    }

    selectedProducts_u(): FormArray {
        return this.productForm_update.get('selectedProducts_u') as FormArray;
    }

    newSelectProduct(): FormGroup {
        return this.fb.group({
            product_id: '',
            qty: '',
            price: 0,
        });
    }

    newSelectProduct_u(products:any ): FormGroup {
       
        return this.fb_u.group({
            
                    product_id: products!=null? products.product.id : '',
                    qty: products!=null?  products.qty : '',
                    price:  products!=null? products.price : '',
                });
        
    }

    updateProductsFrom(order:any){
        this.selectedProducts_u().clear();
        this.updateContainer = 'show';
        this.selectedOrder=order;
        console.log(order.orderedProducts.length);
        

        for(var i=0; i<order.orderedProducts.length; i++){
            this.selectedProducts_u().push(this.newSelectProduct_u(order.orderedProducts[i]));
        }

        
    }

    addProduct() {
        this.selectedProducts().push(this.newSelectProduct());
    }

    removeProduct(i: number) {
        this.selectedProducts().removeAt(i);
    }

    addProduct_u() {
        this.selectedProducts_u().push(this.newSelectProduct_u(null));
    }

    removeProduct_u(i: number) {
        this.selectedProducts_u().removeAt(i);
    }

    getTotalAmount() {
        let sum = 0;
        this.productForm.value.selectedProducts.forEach(element => sum += element.price);
        return sum;
    }

    getTotalAmount_u() {
        let sum = 0;
        this.productForm_update.value.selectedProducts_u.forEach(element => sum += element.price);
        return sum;
    }

    filterByRegion(value: string) {
        this.spinner.show();
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            console.log(value);
            // Destroy the table first
            dtInstance.destroy();
            // Call the dtTrigger to rerender again
            this.loadDatatables('r_id=' + value);
            setTimeout(() => {
                this.dtTrigger.next();
                this.spinner.hide();
            }, 500);
        });
    }
}

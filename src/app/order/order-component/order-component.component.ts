import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from '../../dashboards/_alert'
import { EndPoints } from 'src/app/shared/EndPoints';
import { LoggerService } from 'src/app/shared/logger.service';
import { ApiManagerService } from '../api-manager.service';
import { FormGroup, FormControl, FormArray, FormBuilder } from '@angular/forms'

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


export class OrderComponentComponent implements OnInit {

  dtOptions: DataTables.Settings = {};
  products: any;
  orders:any;
  productCount:number;
  productTotal:number;
  category:{
    id:any;
    name:any;
    childCategory:any[];
  };
  selectedProduct:any[];
  product: any;
  updateContainer: string;
  productForm: FormGroup;
  constructor(
              private apiService: ApiManagerService,
              private loggerService: LoggerService,
              private spinner: NgxSpinnerService,
              private http: HttpClient,
              private endpoints: EndPoints,
              private alertService: AlertService,
              private fb:FormBuilder
  ) {
    this.productForm = this.fb.group({
      
      selectedProducts: this.fb.array([]) ,
    });
   }

  ngOnInit(): void {
    this.productCount=2;
    this.addProduct();
    this.getAllProducts();
    this.updateContainer = "hidden";
    const that = this;
    this.dtOptions = {
      pagingType: 'simple_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      ajax: (dataTablesParameters: any, callback) => {
        that.http.post<DataTablesResponse>(this.endpoints.getOrders,
          dataTablesParameters, {}
        ).subscribe(resp => {
          that.orders = resp.data;
          console.log(resp.data)
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
        {data:'order_date'},
        {data:'orderedProducts'}
      ]
    };
  }

  createOrder() {
    this.spinner.show();
    const data = {
      "products": this.productForm.value.selectedProducts,
      "order_date":new Date(),
      "total": this.getTotalAmount(),
      "rid":3,
      "uid":localStorage.getItem('user_id'),
    }
    this.apiService.create(data).subscribe((response: any) => {
        this.spinner.hide();
       
        this.alertService.success("POrder Placed Successfully");
      },
      error => {
        this.spinner.hide();
        this.loggerService.log('error', error);
        this.alertService.error("Something went wrong");
      }
    )
  }

  getAllProducts(){
    this.apiService.getAllNoPage().subscribe((response:any)=>{
      this.products=response;
     
    })
  }

  setProductTotal(produc:any,i:number){
    console.log(i)
    var filterResult =this.products.filter(prod=> {
      return prod.id==produc.value.product_id
    });

    this.selectedProducts().value[i].price=filterResult[0].price*produc.value.qty;
    
    
  }

  // related to product list and add products and quty##########################

  selectedProducts() : FormArray {
    return this.productForm.get("selectedProducts") as FormArray
  }
   
  newSelectProduct(): FormGroup {
    return this.fb.group({
      product_id:'',
      qty: '',
      price: 0,
    })
  }
   
  addProduct() {
    this.selectedProducts().push(this.newSelectProduct());
  }
   
  removeProduct(i:number) {
    this.selectedProducts().removeAt(i);
  }
  
  getTotalAmount(){
    let sum=0;
    this.productForm.value.selectedProducts.forEach(element => sum+= element.price);
   
    return sum;
  }
 

}

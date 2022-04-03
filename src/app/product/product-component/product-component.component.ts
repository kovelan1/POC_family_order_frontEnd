import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from '../../dashboards/_alert'
import { EndPoints } from 'src/app/shared/EndPoints';
import { LoggerService } from 'src/app/shared/logger.service';
import { ApiManagerService } from '../api-manager.service';

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

  dtOptions: DataTables.Settings = {};
  products: any;
  parentCategories: any;
  subCategories:any;
  category:{
    id:any;
    name:any;
    childCategory:any[];
  };
  product: any;
  updateContainer: string;
  constructor(
              private apiService: ApiManagerService,
              private loggerService: LoggerService,
              private spinner: NgxSpinnerService,
              private http: HttpClient,
              private endpoints: EndPoints,
              private alertService: AlertService
  ) { }

  ngOnInit(): void {
    
    this.updateContainer = "hidden";
    this.getAllParentCategories();
    const that = this;
    this.alertService.success("Category Created Successfully");
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
        {data:'price'},
        {data:'category'}
      ]
    };
  }

  createProduct(name: string,price:number, categoryID: number) {
    this.spinner.show();
    const data = {
      "name": name,
      "price":price,
      "catID": categoryID
    }
    this.apiService.create(data).subscribe((response: any) => {
        this.spinner.hide();
        console.log(response)
        this.alertService.success("Product Created Successfully");
      },
      error => {
        this.spinner.hide();
        this.loggerService.log('error', error);
        this.alertService.error("Something went wrong");
      }
    )
  }

  updateProduct(productId:number, name: string, price:number, categoryID: number){
    this.spinner.show();
    const data = {
      "name": name,
      "price":price,
      "catID": categoryID
    }
    this.apiService.update(data,productId).subscribe((response: any) => {
        this.spinner.hide();
        console.log(response)
        this.alertService.success("Product Updated Successfully");
      },
      error => {
        this.spinner.hide();
        this.loggerService.log('error', error);
        this.alertService.error("Something went wrong");
      }
    )
  }

  getData(prod: any) {
    this.spinner.show();
        this.spinner.hide();
        this.updateContainer = "show";
        this.product = prod;
        console.log(prod)
      
  }
  
  getAllParentCategories(){
    this.spinner.show();
    this.apiService.getParentCategories().subscribe((response:any)=>{
      console.log(response);
      this.parentCategories=response;
    },
    error => {
      this.spinner.hide();
      this.loggerService.log('error', error);
    }
    )
    this.spinner.hide();
  }

  getSubcatByParent(catId:any){
    console.log("comming.....")
    console.log(catId);
    
    var filterResult =this.parentCategories.filter(cate=> {
      return cate.id==catId
    });

    this.category=filterResult[0].childCategory;
  }

  addProduct(){

  }

}


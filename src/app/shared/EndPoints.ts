import {environment} from "../../environments/environment";
import { OnInit} from '@angular/core';

export class EndPoints {
  private baseUrl = environment.base_url;

  public readonly createCat = this.baseUrl + 'api/category/create';
  public readonly getParent = this.baseUrl + 'api/category/get/parent';
  public readonly getAllCat = this.baseUrl + 'api/category/get/all';
  public readonly getSpecificCat = this.baseUrl + 'api/category/get/';
  public readonly updateCat = this.baseUrl + 'api/category/update/';

  public readonly createReg = this.baseUrl + 'api/region/create';
  public readonly getReg = this.baseUrl + 'api/region/get/all';
  public readonly updateReg = this.baseUrl + 'api/region/update/';

  public readonly createProduct = this.baseUrl + 'api/product/create';
  public readonly getProducts = this.baseUrl + 'api/product/get/all';
  public readonly updateProduct = this.baseUrl + 'api/product/update/';
  public readonly getProductByCat = this.baseUrl + 'api/product/get/';
  public readonly getProductsNopage = this.baseUrl + 'api/product/all';

  public readonly createOrder = this.baseUrl + 'api/order/create';
  public readonly getOrders = this.baseUrl + 'api/order/get/all';
  public readonly updateOrder = this.baseUrl + 'api/order/update/';

  public readonly getOrdersByregion = this.baseUrl + 'api/order/get/region/';
  public readonly getOrdersByCustomer = this.baseUrl + 'api/order/get/customer/';
}

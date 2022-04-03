import {environment} from "../../environments/environment";

export class EndPoints {
  private baseUrl = environment.base_url;

  public readonly createCat = this.baseUrl + 'api/category/create';
  public readonly getParent = this.baseUrl + 'api/category/get/parent';
  public readonly getAllCat = this.baseUrl + 'api/category/get/all';
  public readonly getSpecificCat = this.baseUrl + 'api/category/get/';
  public readonly updateCat = this.baseUrl + 'api/category/update/';
}

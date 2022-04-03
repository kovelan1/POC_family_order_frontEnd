import {Component, OnInit} from '@angular/core';
import {CategoryApiManagerService} from "../../category/category-api-manager.service";
import {LoggerService} from "../../shared/logger.service";
import {NgxSpinnerService} from "ngx-spinner";
import {HttpClient} from "@angular/common/http";
import {AlertService} from "../../category/_alert";
import {ApiManagerService} from "../api-manager.service";
import {EndPoints} from "../../shared/EndPoints";

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}

@Component({
  selector: 'app-region-component',
  templateUrl: './region-component.component.html',
  styleUrls: ['./region-component.component.css']
})
export class RegionComponentComponent implements OnInit {
  dtOptions: DataTables.Settings = {};
  regions: any;
  parentCategories: any;
  region: any;
  updateContainer: string;

  constructor(private apiService: ApiManagerService,
              private loggerService: LoggerService,
              private spinner: NgxSpinnerService,
              private http: HttpClient,
              private endpoints: EndPoints,
              private alertService: AlertService) {
  }

  ngOnInit(): void {
    this.updateContainer = "hidden";
    
    const that = this;

    this.dtOptions = {
      pagingType: 'simple_numbers',
      pageLength: 5,
      serverSide: true,
      processing: true,
      ajax: (dataTablesParameters: any, callback) => {
        that.http.post<DataTablesResponse>(this.endpoints.getReg,
          dataTablesParameters, {}
        ).subscribe(resp => {
          that.regions = resp.data;
          callback({
            recordsTotal: resp.recordsTotal,
            recordsFiltered: resp.recordsFiltered,
            data: []
          });
        });
      },
      searching: false,
     
      columns: [
        {data: 'id',
        
      },
        {data: 'name',
        
       
      }
      ],

      
    };
  }

  createRegion(name: string) {
    this.spinner.show();
    const data = {
      "name": name
    }
    this.apiService.create(data).subscribe((response: any) => {
        this.spinner.hide();
        console.log(response)
        this.alertService.success("Region Created Successfully");
      },
      error => {
        this.spinner.hide();
        this.loggerService.log('error', error);
      }
    )
  }

  // getAllRegions() {
  //   this.spinner.show();
  //   this.apiService.get().subscribe((response: any) => {
  //       this.spinner.hide();
  //       this.regions = response;
  //       console.log(this.regions)
  //     },
  //     error => {
  //       this.spinner.hide();
  //       this.loggerService.log('error', error);
  //     }
  //   )
  // }

  // ngAfterViewInit(): void {

  // }

  getData(region: any) {
    this.spinner.show();
    this.updateContainer = "show";
    this.region=region;
    this.spinner.hide();
  }

  updateRegion(name: string, id: string) {
    const data = {
      "name": name
    }
    this.apiService.update(data, id).subscribe((response: any) => {
        this.spinner.hide();
        this.updateContainer = "hidden";
        this.region = null;
        console.log(this.updateContainer);
        console.log(response);
      },
      error => {
        this.spinner.hide(); 
        console.log(error);
      }
    )
    
  }
}

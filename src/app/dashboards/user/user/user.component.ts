import {HttpClient} from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import {NgxSpinnerService} from 'ngx-spinner';
import {LoggerService} from 'src/app/shared/logger.service';
import {AlertService} from '../../_alert/alert.service';
import {EndPoints} from '../../_models/EndPoints';
import {ApiManagerService} from '../../_services/api-manager.service';

class DataTablesResponse {
    data: any[];
    draw: number;
    recordsFiltered: number;
    recordsTotal: number;
}

@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

    dtOptions: DataTables.Settings = {};
    regions: any;
    users: any;
    admins: any;
    parentCategories: any;
    region: any;
    updateContainer: string;

    constructor(
        private apiService: ApiManagerService,
        private spinner: NgxSpinnerService,
        private loggerService: LoggerService,
        private http: HttpClient,
        private endpoints: EndPoints,
        private alertService: AlertService
    ) {
    }

    ngOnInit(): void {

        this.getAllRegions();
        const that = this;

        this.dtOptions = {
            pagingType: 'simple_numbers',
            pageLength: 5,
            serverSide: true,
            processing: true,
            ajax: (dataTablesParameters: any, callback) => {
                that.http.post<DataTablesResponse>(this.endpoints.getUsersByRole,
                    dataTablesParameters, {}
                ).subscribe(resp => {
                    that.users = resp.data;
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
                {data: 'name'},
                {data: 'region'},
                {data: 'roles'}],
        };
    }

    getAllRegions() {
        this.apiService.getRegions().subscribe(
            (response: any) => {
                this.spinner.hide();
                this.regions = response;
            },
            error => {
                this.spinner.hide();
                this.loggerService.log('error', error);
            }
        );

    }


    createAdmin(name: any, userName: any, password: any, region: any) {
        const data = {
            'name': name,
            'username': userName,
            'password': password,
            'regionId': region,
            'type': 2
        };

        this.apiService.addAdmin(data).subscribe((response: any) => {
                this.spinner.hide();
                console.log(response);
                this.alertService.success('Admin Account Successfully');
            },
            error => {
                this.spinner.hide();
                this.loggerService.log('error', error);
            }
        );

    }

    filterRole(role: any) {
        this.users = this.users.filter(u => u.roles.some(r => r.name === role));
        console.log('on filter');

        console.log(this.users);
    }

    adminFilter() {
        this.admins = this.users.filter(u => u.roles.some(r => r.name === 'ROLE_ADMIN'));
    }

    customerFilter() {
        this.admins = this.users.filter(u => u.roles.some(r => r.name === 'ROLE_ADMIN'));
    }

}

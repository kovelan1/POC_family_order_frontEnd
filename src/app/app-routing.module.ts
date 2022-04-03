import {Routes, RouterModule} from '@angular/router';

import {FullComponent} from './layouts/full/full.component';
import {BlankComponent} from './layouts/blank/blank.component';
import {AuthGuard} from './_guards/auth.guard';
import {UserGuard} from './_guards/user.guard';
import {ManageCategoryComponent} from "./category/manage-category/manage-category.component";
import {RegionComponentComponent} from "./region/region-component/region-component.component";
import { ProductComponentComponent } from './product/product-component/product-component.component';
import {OrderComponentComponent} from './order/order-component/order-component.component'
export const Approutes: Routes = [
  {
    path: '',
    component: BlankComponent,
    children: [
      {path: '', redirectTo: '/authentication/login', pathMatch: 'full'},
      {
        path: 'authentication',
        loadChildren:
          () => import('./authentication/authentication.module').then(m => m.AuthenticationModule)
      }
    ]
  },
  {
    path: '',
    component: FullComponent,
    children: [
      {
        path: 'manage-category',
        component: ManageCategoryComponent,
        canActivate: [AuthGuard,UserGuard]
      },
      {
        path: 'manage-region',
        component: RegionComponentComponent,
        canActivate: [AuthGuard,UserGuard]
      },
      {
        path: 'manage-product',
        component: ProductComponentComponent,
        canActivate: [AuthGuard,UserGuard]
      },
      {
        path: 'manage-order',
        component: OrderComponentComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./dashboards/dashboard.module').then(m => m.DashboardModule),
        canActivate: [AuthGuard]
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/authentication/404'
  }
];

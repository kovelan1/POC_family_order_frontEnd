import {Routes} from '@angular/router';
import { UserGuard } from '../_guards/user.guard';
import {Dashboard3Component} from './dashboard3/dashboard3.component';
import {ProfileComponent} from './profile/profile.component';
import { UserComponent } from './user/user/user.component';

export const DashboardRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'home',
        component: Dashboard3Component,
        data: {
          title: 'Docasigner',
          urls: [
            {title: 'dashboard', url: '/dashboard/home'},
            {title: 'home'}
          ]
        }
      },
      {
        path: 'user',
        component: UserComponent,
        data: {
          title: 'Manage User',
          urls: [
            {title: 'dashboard', url: '/dashboard/user'},
            {title: 'user'}
          ]
        },
        canActivate:[UserGuard]
      },
      {
        path: 'edit-profile',
        component: ProfileComponent,
        data: {
          title: 'edit_profile',
          urls: [
            {title: 'profile', url: '/dashboard/edit-profile'},
            {title: 'edit'}
          ]
        }
      }
    ]
  }
];

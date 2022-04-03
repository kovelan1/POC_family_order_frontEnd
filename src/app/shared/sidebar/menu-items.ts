import {RouteInfo} from './sidebar.metadata';

export const ADMINS_ROUTES: RouteInfo[] = [
  {
    path: '',
    title: 'dashboard',
    icon: 'icon-Car-Wheel',
    class: 'nav-small-cap',
    extralink: true,
    submenu: []
  },
  {
    path: '/dashboard/home',
    title: 'home',
    icon: 'icon-Home',
    class: '',
    extralink: false,
    submenu: []
  },
  {
    path: '/dashboard/user',
    title: 'Manage User',
    icon: 'icon-User',
    class: '',
    extralink: false,
    submenu: []
  },
  {
    path: '',
    title: 'Menus',
    icon: 'icon-Bird',
    class: 'nav-small-cap',
    extralink: true,
    submenu: []
  },
  {
    path: '/manage-category',
    title: 'Manage Category',
    icon: 'icon-Files',
    class: '',
    extralink: false,
    submenu: []
  },
  {
    path: '/manage-region',
    title: 'Manage Region',
    icon: 'icon-Files',
    class: '',
    extralink: false,
    submenu: []
  },
  {
    path: '/manage-product',
    title: 'Manage Product',
    icon: 'icon-Files',
    class: '',
    extralink: false,
    submenu: []
  },
  {
    path: '/manage-order',
    title: 'Manage Order',
    icon: 'icon-Files',
    class: '',
    extralink: false,
    submenu: []
  }
];

export const CUSTOMER_ROUTES: RouteInfo[] = [
  {
    path: '',
    title: 'dashboard',
    icon: 'icon-Car-Wheel',
    class: 'nav-small-cap',
    extralink: true,
    submenu: []
  },
  {
    path: '/dashboard/home',
    title: 'home',
    icon: 'icon-Home',
    class: '',
    extralink: false,
    submenu: []
  },
  {
    path: '',
    title: 'Menus',
    icon: 'icon-Bird',
    class: 'nav-small-cap',
    extralink: true,
    submenu: []
  },
  {
    path: '/manage-order',
    title: 'Manage Order',
    icon: 'icon-Files',
    class: '',
    extralink: false,
    submenu: []
  }
];

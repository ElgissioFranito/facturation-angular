import { Routes } from '@angular/router';
import { MainLayoutComponent } from './core/layout/main-layout/main-layout.component';
import { authGuard } from './core/guards/auth.guard';

// Main application routes
export const routes: Routes = [
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
    },
    {
        path: 'auth',
        loadChildren: () => import('./features/auth-page/auth.routes').then(m => m.AUTH_ROUTES)
    },
    {
        path: '',
        component: MainLayoutComponent,
        canActivate: [authGuard],
        children: [
            {
                path: 'dashboard',
                loadComponent: () => import('./features/dashboard-page/dashboard-page.component').then(m => m.DashboardPageComponent)
            },
            {
                path: 'clients',
                loadComponent: () => import('./features/clients-page/clients-page.component').then(m => m.ClientsPageComponent)
            },
            {
                path: 'invoices',
                loadChildren: () => import('./features/invoices-page/invoices.routes').then(m => m.INVOICES_ROUTES)
            },
            {
                path: 'products',
                loadComponent: () => import('./features/products-page/products-page.component').then(m => m.ProductsPageComponent)
            },
            {
                path: 'receipts',
                loadComponent: () => import('./features/receipts-page/receipts-page.component').then(m => m.ReceiptsPageComponent)
            },
            {
                path: 'settings',
                loadComponent: () => import('./features/settings-page/settings-page.component').then(m => m.SettingsPageComponent)
            }
        ]
    },
    { path: '**', redirectTo: 'dashboard' }
];



import { Routes } from '@angular/router';
import { InvoiceListComponent } from './invoice-list/invoice-list.component';
import { CreateInvoiceComponent } from './create-invoice/create-invoice.component';
import { InvoiceDetailComponent } from './invoice-detail/invoice-detail.component';

export const INVOICES_ROUTES: Routes = [
    {
        path: '',
        component: InvoiceListComponent
    },
    {
        path: 'new',
        component: CreateInvoiceComponent
    },
    {
        path: 'edit/:id',
        component: CreateInvoiceComponent
    },
    {
        path: ':id',
        component: InvoiceDetailComponent
    }
];

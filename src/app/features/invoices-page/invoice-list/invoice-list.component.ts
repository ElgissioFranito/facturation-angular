import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { InvoiceService } from '../../../core/services/api/invoice.service';
import { TableComponent, TableHeaderComponent, TableBodyComponent, TableRowComponent, TableHeadComponent, TableCellComponent } from '../../../shared/components/ui/table/table.component';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { InputComponent } from '../../../shared/components/ui/input/input.component';

@Component({
  selector: 'app-invoice-list',
  standalone: true,
  imports: [
    CommonModule,
    TableComponent, TableHeaderComponent, TableBodyComponent, TableRowComponent, TableHeadComponent, TableCellComponent,
    ButtonComponent, InputComponent,
    LucideAngularModule, CurrencyPipe, DatePipe
  ],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
           <h2 class="text-3xl font-bold tracking-tight">Factures</h2>
           <p class="text-muted-foreground">Historique de vos facturations.</p>
        </div>
        <button app-button (click)="createInvoice()">
          <lucide-icon name="plus" class="mr-2 h-4 w-4"></lucide-icon>
          Nouvelle Facture
        </button>
      </div>

      <div class="flex items-center py-4">
        <input app-input placeholder="Filtrer par client ou n°..." class="max-w-sm" (input)="filter($event)" />
      </div>

      <div class="rounded-md border border-border">
        <app-table>
          <app-table-header>
            <app-table-row>
              <app-table-head>N° Facture</app-table-head>
              <app-table-head>Client</app-table-head>
              <app-table-head>Date</app-table-head>
              <app-table-head>Échéance</app-table-head>
              <app-table-head>Statut</app-table-head>
              <app-table-head class="text-right">Total TTC</app-table-head>
              <app-table-head class="w-[50px]"></app-table-head>
            </app-table-row>
          </app-table-header>
          <app-table-body>
            @for (invoice of filteredInvoices(); track invoice.id) {
              <app-table-row>
                <app-table-cell class="font-medium">{{ invoice.id }}</app-table-cell>
                <app-table-cell>{{ invoice.clientName }}</app-table-cell>
                <app-table-cell>{{ invoice.date | date:'dd/MM/yyyy' }}</app-table-cell>
                <app-table-cell>{{ invoice.dueDate | date:'dd/MM/yyyy' }}</app-table-cell>
                <app-table-cell>
                  <span [class]="getStatusClass(invoice.status)">
                    {{ getStatusLabel(invoice.status) }}
                  </span>
                </app-table-cell>
                <app-table-cell class="text-right font-bold">{{ invoice.total | currency:'EUR' }}</app-table-cell>
                <app-table-cell>
                  <button app-button variant="ghost" size="icon" (click)="viewInvoice(invoice.id)">
                    <lucide-icon name="eye" class="h-4 w-4"></lucide-icon>
                  </button>
                </app-table-cell>
              </app-table-row>
            }
          </app-table-body>
        </app-table>
      </div>
    </div>
  `
})
export class InvoiceListComponent {
  invoiceService = inject(InvoiceService);
  router = inject(Router);
  invoices = this.invoiceService.getInvoices();
  filterText = signal('');

  filteredInvoices = computed(() => {
    const text = this.filterText().toLowerCase();
    return this.invoices().filter(i =>
      i.clientName.toLowerCase().includes(text) ||
      i.id.toLowerCase().includes(text)
    );
  });

  filter(event: Event) {
    const input = event.target as HTMLInputElement;
    this.filterText.set(input.value);
  }

  createInvoice() {
    this.router.navigate(['/invoices/new']);
  }

  viewInvoice(id: string) {
    // For now navigate to new (edit mode later) or preview
    console.log('View', id);
  }

  getStatusClass(status: string) {
    switch (status) {
      case 'paid': return 'inline-flex items-center rounded-full border border-transparent bg-success/10 px-2.5 py-0.5 text-xs font-semibold text-success';
      case 'pending': return 'inline-flex items-center rounded-full border border-transparent bg-warning/10 px-2.5 py-0.5 text-xs font-semibold text-warning';
      case 'overdue': return 'inline-flex items-center rounded-full border border-transparent bg-destructive/10 px-2.5 py-0.5 text-xs font-semibold text-destructive';
      default: return 'inline-flex items-center rounded-full border border-transparent bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground';
    }
  }

  getStatusLabel(status: string) {
    switch (status) {
      case 'paid': return 'Payée';
      case 'pending': return 'En attente';
      case 'overdue': return 'En retard';
      case 'draft': return 'Brouillon';
      default: return status;
    }
  }
}

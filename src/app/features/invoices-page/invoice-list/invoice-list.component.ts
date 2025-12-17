import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { InvoiceService } from '../../../core/services/api/invoice.service';
import { TableComponent, TableHeaderComponent, TableBodyComponent, TableRowComponent, TableHeadComponent, TableCellComponent } from '../../../shared/components/ui/table/table.component';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { InputComponent } from '../../../shared/components/ui/input/input.component';
import { PdfService } from '../../../core/services/utils/pdf.service';
import { Invoice } from '../../../shared/models/invoice.model';
import { CompanyService } from '../../../core/services/api/company.service';

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
      <div class="flex items-center justify-between flex-wrap gap-4">
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

      <div class="rounded-md border border-border overflow-x-auto">
        <app-table class="min-w-[800px]">
          <thead app-table-header>
            <tr app-table-row>
              <th app-table-head>N° Facture</th>
              <th app-table-head>Client</th>
              <th app-table-head>Date</th>
              <th app-table-head>Échéance</th>
              <th app-table-head>Statut</th>
              <th app-table-head class="text-right">Total TTC</th>
              <th app-table-head class="w-[180px] text-right">Actions</th>
            </tr>
          </thead>
          <tbody app-table-body>
            @for (invoice of filteredInvoices(); track invoice.id) {
              <tr app-table-row>
                <td app-table-cell class="font-medium">{{ invoice.id }}</td>
                <td app-table-cell>{{ invoice.clientName }}</td>
                <td app-table-cell>{{ invoice.date | date:'dd/MM/yyyy' }}</td>
                <td app-table-cell>{{ invoice.dueDate | date:'dd/MM/yyyy' }}</td>
                <td app-table-cell>
                  <span [class]="getStatusClass(invoice.status)">
                    {{ getStatusLabel(invoice.status) }}
                  </span>
                </td>
                <td app-table-cell class="text-right font-bold">{{ invoice.total | currency:currencyCode():'symbol':'1.2-2' }}</td>
                <td app-table-cell class="text-right">
                  <div class="flex items-center justify-end gap-1">
                    <button app-button variant="ghost" size="icon" title="Voir" (click)="viewInvoice(invoice)">
                      <lucide-icon name="eye" class="h-4 w-4"></lucide-icon>
                    </button>
                    <button app-button variant="ghost" size="icon" title="Dupliquer" (click)="duplicate(invoice)">
                      <lucide-icon name="copy" class="h-4 w-4"></lucide-icon>
                    </button>
                    <button app-button variant="ghost" size="icon" title="Télécharger PDF" (click)="downloadPdf(invoice)">
                      <lucide-icon name="download" class="h-4 w-4"></lucide-icon>
                    </button>
                    <button app-button variant="ghost" size="icon" title="Imprimer" (click)="printInvoice(invoice)">
                      <lucide-icon name="printer" class="h-4 w-4"></lucide-icon>
                    </button>
                    @if (invoice.status !== 'paid') {
                      <button app-button variant="ghost" size="icon" title="Marquer payée" (click)="markAsPaid(invoice)">
                        <lucide-icon name="circle-check" class="h-4 w-4 text-success"></lucide-icon>
                      </button>
                    }
                  </div>
                </td>
              </tr>
            }
          </tbody>
        </app-table>
      </div>
    </div>
  `
})
export class InvoiceListComponent {
  invoiceService = inject(InvoiceService);
  pdfService = inject(PdfService);
  router = inject(Router);
  companyService = inject(CompanyService);
  currencyCode = computed(() => this.companyService.currentSettings().currency);

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


  duplicate(invoice: Invoice) {
    const newInvoice: Invoice = {
      ...invoice,
      id: `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`,
      date: new Date(),
      dueDate: new Date(new Date().setDate(new Date().getDate() + 30)),
      status: 'pending'
    };
    this.invoiceService.addInvoice(newInvoice);
  }

  downloadPdf(invoice: Invoice) {
    this.pdfService.generateInvoicePdf(invoice, 'download');
  }

  viewInvoice(invoice: Invoice) {
    this.router.navigate(['/invoices', invoice.id]);
  }

  printInvoice(invoice: Invoice) {
    this.pdfService.generateInvoicePdf(invoice, 'print');
  }

  markAsPaid(invoice: Invoice) {
    this.invoiceService.updateInvoice({ ...invoice, status: 'paid' });
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


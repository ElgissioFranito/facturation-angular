import { Component, inject, signal, computed } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { ReceiptService } from '../../core/services/api/receipt.service';
import { Receipt } from '../../shared/models/receipt.model';
import { TableComponent, TableHeaderComponent, TableBodyComponent, TableRowComponent, TableHeadComponent, TableCellComponent } from '../../shared/components/ui/table/table.component';
import { ButtonComponent } from '../../shared/components/ui/button/button.component';
import { InputComponent } from '../../shared/components/ui/input/input.component';
import { ReceiptDialogComponent } from './components/receipt-dialog/receipt-dialog.component';
import { PdfService } from '../../core/services/utils/pdf.service';
import { CompanyService } from '../../core/services/api/company.service';

@Component({
  selector: 'app-receipts-page',
  standalone: true,
  imports: [
    TableComponent, TableHeaderComponent, TableBodyComponent, TableRowComponent, TableHeadComponent, TableCellComponent,
    ButtonComponent, InputComponent, ReceiptDialogComponent,
    LucideAngularModule, CurrencyPipe, DatePipe
  ],
  template: `
    <div class="space-y-6">
      <app-receipt-dialog [open]="dialogOpen()" (openChange)="dialogOpen.set($event)" [receipt]="selectedReceipt()"></app-receipt-dialog>

      <div class="flex items-center justify-between flex-wrap gap-4">
        <div>
           <h2 class="text-3xl font-bold tracking-tight">Reçus</h2>
           <p class="text-muted-foreground">Gestion des reçus et factures fournisseurs.</p>
        </div>
        <button app-button (click)="openAddDialog()">
          <lucide-icon name="plus" class="mr-2 h-4 w-4"></lucide-icon>
          Ajouter un reçu
        </button>
      </div>

      <div class="flex items-center py-4">
        <input app-input placeholder="Filtrer par marchand..." class="max-w-sm" (input)="filter($event)" />
      </div>

      <div class="rounded-md border border-border overflow-x-auto">
        <app-table class="min-w-[800px]">
          <thead app-table-header>
            <tr app-table-row>
              <th app-table-head>Date</th>
              <th app-table-head>Marchand</th>
              <th app-table-head>Catégorie</th>
              <th app-table-head>Description</th>
              <th app-table-head>Statut</th>
              <th app-table-head class="text-right">Montant</th>
              <th app-table-head class="w-[120px] text-right">Actions</th>
            </tr>
          </thead>
          <tbody app-table-body>
            @for (receipt of filteredReceipts(); track receipt.id) {
              <tr app-table-row>
                <td app-table-cell>{{ receipt.date | date:'dd/MM/yyyy' }}</td>
                <td app-table-cell class="font-medium">{{ receipt.merchant }}</td>
                <td app-table-cell>{{ receipt.category }}</td>
                <td app-table-cell class="text-muted-foreground">{{ receipt.description }}</td>
                <td app-table-cell>
                   <span [class]="getStatusClass(receipt.status)">
                    {{ getStatusLabel(receipt.status) }}
                  </span>
                </td>
                <td app-table-cell class="text-right font-bold">{{ receipt.amount | currency:currencyCode():'symbol':'1.2-2' }}</td>
                <td app-table-cell class="text-right">
                  <div class="flex items-center justify-end gap-1">
                    <button app-button variant="ghost" size="icon" title="Modifier" (click)="editReceipt(receipt)">
                        <lucide-icon name="settings" class="h-4 w-4"></lucide-icon>
                    </button>
                    <button app-button variant="ghost" size="icon" title="Télécharger PDF" (click)="downloadPdf(receipt)">
                        <lucide-icon name="download" class="h-4 w-4"></lucide-icon>
                    </button>
                    <button app-button variant="ghost" size="icon" title="Imprimer" (click)="printReceipt(receipt)">
                        <lucide-icon name="printer" class="h-4 w-4"></lucide-icon>
                    </button>
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
export class ReceiptsPageComponent {
  receiptService = inject(ReceiptService);
  pdfService = inject(PdfService);
  companyService = inject(CompanyService);
  currencyCode = computed(() => this.companyService.currentSettings().currency);

  receipts = this.receiptService.getReceipts();
  filterText = signal('');

  filteredReceipts = computed(() => {
    const text = this.filterText().toLowerCase();
    return this.receipts().filter(r =>
      r.merchant.toLowerCase().includes(text) ||
      r.category.toLowerCase().includes(text)
    );
  });

  dialogOpen = signal(false);
  selectedReceipt = signal<Partial<Receipt>>({});

  filter(event: Event) {
    const input = event.target as HTMLInputElement;
    this.filterText.set(input.value);
  }

  openAddDialog() {
    this.selectedReceipt.set({});
    this.dialogOpen.set(true);
  }

  editReceipt(receipt: Receipt) {
    this.selectedReceipt.set({ ...receipt });
    this.dialogOpen.set(true);
  }

  downloadPdf(receipt: Receipt) {
    this.pdfService.generateReceiptPdf(receipt, 'download');
  }

  printReceipt(receipt: Receipt) {
    this.pdfService.generateReceiptPdf(receipt, 'print');
  }

  getStatusClass(status: string) {
    switch (status) {
      case 'reimbursed': return 'inline-flex items-center rounded-full border border-transparent bg-success/10 px-2.5 py-0.5 text-xs font-semibold text-success';
      case 'pending': return 'inline-flex items-center rounded-full border border-transparent bg-warning/10 px-2.5 py-0.5 text-xs font-semibold text-warning';
      case 'rejected': return 'inline-flex items-center rounded-full border border-transparent bg-destructive/10 px-2.5 py-0.5 text-xs font-semibold text-destructive';
      default: return 'inline-flex items-center rounded-full border border-transparent bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground';
    }
  }

  getStatusLabel(status: string) {
    switch (status) {
      case 'reimbursed': return 'Remboursé';
      case 'pending': return 'En attente';
      case 'rejected': return 'Rejeté';
      default: return status;
    }
  }
}


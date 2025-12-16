import { Component, inject, signal, computed } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { ReceiptService } from '../../core/services/api/receipt.service';
import { Receipt } from '../../shared/models/receipt.model';
import { TableComponent, TableHeaderComponent, TableBodyComponent, TableRowComponent, TableHeadComponent, TableCellComponent } from '../../shared/components/ui/table/table.component';
import { ButtonComponent } from '../../shared/components/ui/button/button.component';
import { InputComponent } from '../../shared/components/ui/input/input.component';
import { ReceiptDialogComponent } from './components/receipt-dialog/receipt-dialog.component';

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

      <div class="flex items-center justify-between">
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

      <div class="rounded-md border border-border">
        <app-table>
          <app-table-header>
            <app-table-row>
              <app-table-head>Date</app-table-head>
              <app-table-head>Marchand</app-table-head>
              <app-table-head>Catégorie</app-table-head>
              <app-table-head>Description</app-table-head>
              <app-table-head>Statut</app-table-head>
              <app-table-head class="text-right">Montant</app-table-head>
              <app-table-head class="w-[50px]"></app-table-head>
            </app-table-row>
          </app-table-header>
          <app-table-body>
            @for (receipt of filteredReceipts(); track receipt.id) {
              <app-table-row>
                <app-table-cell>{{ receipt.date | date:'dd/MM/yyyy' }}</app-table-cell>
                <app-table-cell class="font-medium">{{ receipt.merchant }}</app-table-cell>
                <app-table-cell>{{ receipt.category }}</app-table-cell>
                <app-table-cell class="text-muted-foreground">{{ receipt.description }}</app-table-cell>
                <app-table-cell>
                   <span [class]="getStatusClass(receipt.status)">
                    {{ getStatusLabel(receipt.status) }}
                  </span>
                </app-table-cell>
                <app-table-cell class="text-right font-bold">{{ receipt.amount | currency:'EUR' }}</app-table-cell>
                <app-table-cell>
                  <button app-button variant="ghost" size="icon" (click)="editReceipt(receipt)">
                    <lucide-icon name="settings" class="h-4 w-4"></lucide-icon>
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
export class ReceiptsPageComponent {
  receiptService = inject(ReceiptService);
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

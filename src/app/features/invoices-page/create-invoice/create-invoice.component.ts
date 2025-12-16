import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { InvoiceService } from '../../../core/services/api/invoice.service';
import { ClientService } from '../../../core/services/api/client.service';
import { ProductService } from '../../../core/services/api/product.service';
import { Invoice, InvoiceItem } from '../../../shared/models/invoice.model';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { InputComponent } from '../../../shared/components/ui/input/input.component';
import { LabelComponent } from '../../../shared/components/ui/label/label.component';
import { TableComponent, TableHeaderComponent, TableBodyComponent, TableRowComponent, TableHeadComponent, TableCellComponent } from '../../../shared/components/ui/table/table.component';

@Component({
  selector: 'app-create-invoice',
  standalone: true,
  imports: [
    CommonModule, FormsModule, LucideAngularModule,
    ButtonComponent, InputComponent, LabelComponent,
    TableComponent, TableHeaderComponent, TableBodyComponent, TableRowComponent, TableHeadComponent, TableCellComponent,
    CurrencyPipe
  ],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <h2 class="text-3xl font-bold tracking-tight">Nouvelle Facture</h2>
        <div class="flex gap-2">
          <button app-button variant="outline" (click)="cancel()">Annuler</button>
          <button app-button (click)="save()" [disabled]="!isValid()">Enregistrer</button>
        </div>
      </div>

      <div class="grid gap-6 md:grid-cols-2">
        <!-- Client Selection -->
        <div class="rounded-lg border border-border p-6 space-y-4">
          <h3 class="text-lg font-medium">1. Client & Dates</h3>
          <div class="space-y-4">
            <div class="grid gap-2">
              <label app-label>Client</label>
              <select class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" 
                      [(ngModel)]="selectedClientId" (change)="onClientChange()">
                <option [ngValue]="null">Sélectionner un client</option>
                @for (client of clients(); track client.id) {
                  <option [ngValue]="client.id">{{ client.name }}</option>
                }
              </select>
            </div>
            
            <div class="grid grid-cols-2 gap-4">
              <div class="grid gap-2">
                <label app-label>Date de facture</label>
                <input app-input type="date" [ngModel]="date() | date:'yyyy-MM-dd'" (ngModelChange)="date.set($event)" />
              </div>
              <div class="grid gap-2">
                <label app-label>Échéance</label>
                <input app-input type="date" [ngModel]="dueDate() | date:'yyyy-MM-dd'" (ngModelChange)="dueDate.set($event)" />
              </div>
            </div>
          </div>
        </div>

        <!-- Totals Preview -->
        <div class="rounded-lg border border-border p-6 space-y-4 bg-muted/50">
          <h3 class="text-lg font-medium">Résumé</h3>
          <div class="space-y-2">
             <div class="flex justify-between text-sm">
              <span>Sous-total HT</span>
              <span>{{ subtotal() | currency:'EUR' }}</span>
            </div>
             <div class="flex justify-between text-sm">
              <span>TVA (20%)</span>
              <span>{{ taxTotal() | currency:'EUR' }}</span>
            </div>
             <div class="flex justify-between font-bold text-lg border-t border-border pt-2">
              <span>Total TTC</span>
              <span>{{ total() | currency:'EUR' }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Items -->
      <div class="rounded-lg border border-border p-6 space-y-4">
        <div class="flex items-center justify-between">
           <h3 class="text-lg font-medium">2. Services & Produits</h3>
           <button app-button variant="secondary" size="sm" (click)="addItem()">
             <lucide-icon name="plus" class="mr-2 h-4 w-4"></lucide-icon>
             Ajouter une ligne
           </button>
        </div>

        <app-table>
          <app-table-header>
            <app-table-row>
              <app-table-head class="w-[40%]">Description</app-table-head>
              <app-table-head class="text-right w-[15%]">Prix Unit.</app-table-head>
              <app-table-head class="text-right w-[15%]">Qté</app-table-head>
              <app-table-head class="text-right w-[20%]">Total</app-table-head>
              <app-table-head class="w-[10%]"></app-table-head>
            </app-table-row>
          </app-table-header>
          <app-table-body>
            @for (item of items(); track item.id; let i = $index) {
              <app-table-row>
                <app-table-cell>
                  <input app-input [(ngModel)]="item.description" placeholder="Description du service" />
                </app-table-cell>
                <app-table-cell>
                  <input app-input type="number" [(ngModel)]="item.unitPrice" class="text-right" />
                </app-table-cell>
                <app-table-cell>
                  <input app-input type="number" [(ngModel)]="item.quantity" class="text-right" />
                </app-table-cell>
                <app-table-cell class="text-right font-medium">
                  {{ item.quantity * item.unitPrice | currency:'EUR' }}
                </app-table-cell>
                <app-table-cell>
                  <button app-button variant="ghost" size="icon" class="text-destructive hover:text-destructive" (click)="removeItem(i)">
                    <lucide-icon name="trash-2" class="h-4 w-4"></lucide-icon>
                  </button>
                </app-table-cell>
              </app-table-row>
            }
          </app-table-body>
        </app-table>
        
        @if (items().length === 0) {
          <div class="text-center py-8 text-muted-foreground">
            Aucun article. Cliquez sur "Ajouter une ligne" pour commencer.
          </div>
        }
      </div>
    </div>
  `
})
export class CreateInvoiceComponent {
  router = inject(Router);
  invoiceService = inject(InvoiceService);
  clientService = inject(ClientService);
  productService = inject(ProductService);

  clients = this.clientService.getClients();
  products = this.productService.getProducts();

  selectedClientId = signal<number | null>(null);
  date = signal(new Date());
  dueDate = signal(new Date(new Date().setDate(new Date().getDate() + 30)));

  items = signal<InvoiceItem[]>([]);

  subtotal = computed(() => this.items().reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0));
  taxTotal = computed(() => this.subtotal() * 0.2); // Hardcoded 20% for now
  total = computed(() => this.subtotal() + this.taxTotal());

  onClientChange() {
    // Logic to prefill address if needed
  }

  addItem() {
    const newItem: InvoiceItem = {
      id: Date.now(),
      productName: '',
      description: '',
      quantity: 1,
      unitPrice: 0,
      unit: 'item',
      taxRate: 20,
      total: 0
    };
    this.items.update(items => [...items, newItem]);
  }

  removeItem(index: number) {
    this.items.update(items => items.filter((_, i) => i !== index));
  }

  cancel() {
    this.router.navigate(['/invoices']);
  }

  isValid() {
    return this.selectedClientId() !== null && this.items().length > 0;
  }

  save() {
    if (!this.isValid()) return;

    const selectedClient = this.clients().find(c => c.id === this.selectedClientId());

    const invoice: Invoice = {
      id: `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`,
      clientId: this.selectedClientId()!,
      clientName: selectedClient?.name || 'Unknown',
      clientEmail: selectedClient?.email || '',
      clientAddress: selectedClient?.address || '',
      date: new Date(this.date()),
      dueDate: new Date(this.dueDate()),
      status: 'pending',
      items: this.items(),
      subtotal: this.subtotal(),
      taxTotal: this.taxTotal(),
      total: this.total()
    };

    this.invoiceService.addInvoice(invoice);
    this.router.navigate(['/invoices']);
  }
}

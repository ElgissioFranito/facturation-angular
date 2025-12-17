import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { InvoiceService } from '../../../core/services/api/invoice.service';
import { ClientService } from '../../../core/services/api/client.service';
import { ProductService } from '../../../core/services/api/product.service';
import { Invoice, InvoiceItem } from '../../../shared/models/invoice.model';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { InputComponent } from '../../../shared/components/ui/input/input.component';
import { LabelComponent } from '../../../shared/components/ui/label/label.component';
import { TableComponent, TableHeaderComponent, TableBodyComponent, TableRowComponent, TableHeadComponent, TableCellComponent } from '../../../shared/components/ui/table/table.component';
import { PdfService } from '../../../core/services/utils/pdf.service';
import { CompanyService } from '../../../core/services/api/company.service';

@Component({
  selector: 'app-create-invoice',
  standalone: true,
  imports: [
    CommonModule, FormsModule, LucideAngularModule,
    ButtonComponent, InputComponent, LabelComponent,
    TableComponent, TableHeaderComponent, TableBodyComponent, TableRowComponent, TableHeadComponent, TableCellComponent,
    CurrencyPipe, DatePipe
  ],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <h2 class="text-3xl font-bold tracking-tight">{{ isEditing() ? 'Modifier Facture' : 'Nouvelle Facture' }}</h2>
        <div class="flex gap-2">
          <button app-button variant="outline" (click)="cancel()">Annuler</button>
        </div>
      </div>

      <!-- Stepper Header -->
      <div class="flex items-center justify-center gap-4 mb-8">
         <div class="flex items-center gap-2" [class.text-primary]="currentStep() >= 1" [class.text-muted-foreground]="currentStep() < 1">
            <div class="h-8 w-8 rounded-full flex items-center justify-center border font-bold"
                 [class.bg-primary]="currentStep() >= 1" [class.text-primary-foreground]="currentStep() >= 1" [class.border-primary]="currentStep() >= 1">1</div>
            <span class="font-medium hidden sm:inline">Client & Dates</span>
         </div>
         <div class="h-[1px] w-12 bg-border"></div>
         <div class="flex items-center gap-2" [class.text-primary]="currentStep() >= 2" [class.text-muted-foreground]="currentStep() < 2">
            <div class="h-8 w-8 rounded-full flex items-center justify-center border font-bold"
                 [class.bg-primary]="currentStep() >= 2" [class.text-primary-foreground]="currentStep() >= 2" [class.border-primary]="currentStep() >= 2">2</div>
            <span class="font-medium hidden sm:inline">Prestations</span>
         </div>
         <div class="h-[1px] w-12 bg-border"></div>
         <div class="flex items-center gap-2" [class.text-primary]="currentStep() >= 3" [class.text-muted-foreground]="currentStep() < 3">
            <div class="h-8 w-8 rounded-full flex items-center justify-center border font-bold"
                 [class.bg-primary]="currentStep() >= 3" [class.text-primary-foreground]="currentStep() >= 3" [class.border-primary]="currentStep() >= 3">3</div>
            <span class="font-medium hidden sm:inline">Validation</span>
         </div>
      </div>

      <!-- Step 1: Client & Dates -->
      @if (currentStep() === 1) {
        <div class="grid gap-6 md:grid-cols-2 animate-in fade-in slide-in-from-left-4 duration-300">
          <div class="rounded-lg border border-border p-6 space-y-4">
            <h3 class="text-lg font-medium">Informations Client</h3>
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
        </div>
      }

      <!-- Step 2: Items -->
      @if (currentStep() === 2) {
        <div class="rounded-lg border border-border p-6 space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
          <div class="flex items-center justify-between">
             <h3 class="text-lg font-medium">Détail des prestations</h3>
             <button app-button variant="secondary" size="sm" (click)="addItem()">
               <lucide-icon name="plus" class="mr-2 h-4 w-4"></lucide-icon>
               Ajouter une ligne
             </button>
          </div>

          <div class="overflow-x-auto">
            <app-table class="min-w-[700px]">
              <thead app-table-header>
                <tr app-table-row>
                  <th app-table-head class="w-[40%]">Description</th>
                  <th app-table-head class="text-right w-[15%]">Prix Unit.</th>
                  <th app-table-head class="text-right w-[15%]">Qté</th>
                  <th app-table-head class="text-right w-[20%]">Total</th>
                  <th app-table-head class="w-[10%]"></th>
                </tr>
              </thead>
              <tbody app-table-body>
                @for (item of items(); track item.id; let i = $index) {
                  <tr app-table-row>
                    <td app-table-cell>
                      <input app-input [(ngModel)]="item.description" placeholder="Description du service" />
                    </td>
                    <td app-table-cell>
                      <input app-input type="number" [(ngModel)]="item.unitPrice" class="text-right" />
                    </td>
                    <td app-table-cell>
                      <input app-input type="number" [(ngModel)]="item.quantity" class="text-right" />
                    </td>
                    <td app-table-cell class="text-right font-medium">
                      {{ item.quantity * item.unitPrice | currency:'EUR' }}
                    </td>
                    <td app-table-cell>
                      <button app-button variant="ghost" size="icon" class="text-destructive hover:text-destructive" (click)="removeItem(i)">
                        <lucide-icon name="trash-2" class="h-4 w-4"></lucide-icon>
                      </button>
                    </td>
                  </tr>
                }
              </tbody>
            </app-table>
          </div>
          
          @if (items().length === 0) {
            <div class="text-center py-8 text-muted-foreground">
              Aucun article. Cliquez sur "Ajouter une ligne" pour commencer.
            </div>
          }
        </div>
      }

      <!-- Step 3: Preview -->
      @if (currentStep() === 3) {
         <div class="flex flex-col lg:flex-row gap-8 animate-in fade-in slide-in-from-right-4 duration-300">
             
             <!-- Document Preview -->
             <div class="flex-1 overflow-auto bg-muted/30 p-4 rounded-lg flex justify-center">
                <div class="bg-white text-black p-8 shadow-lg max-w-[210mm] min-h-[297mm] w-full flex flex-col justify-between text-sm" style="aspect-ratio: 210/297;">
                    <!-- Header -->
                    <div class="space-y-6">
                        <div class="flex justify-between items-start">
                            <div>
                                <h1 class="text-3xl font-bold text-slate-900 tracking-tight">FACTURE</h1>
                                <p class="text-slate-500 mt-1">#PREVIEW</p>
                            </div>
                            <div class="text-right">
                                <div class="font-bold text-lg">Mon Entreprise</div>
                                <div class="text-slate-500">contact@freelance.com</div>
                            </div>
                        </div>

                        <div class="grid grid-cols-2 gap-8 mt-8">
                            <div>
                                <h3 class="font-bold text-slate-700 mb-2">Facturé à :</h3>
                                <div class="text-slate-600">
                                    <div class="font-medium text-black">{{ getTempInvoiceObject().clientName }}</div>
                                    <div>{{ getTempInvoiceObject().clientEmail }}</div>
                                    <div class="whitespace-pre-line">{{ getTempInvoiceObject().clientAddress }}</div>
                                </div>
                            </div>
                            <div class="text-right space-y-1">
                                <div class="flex justify-between">
                                    <span class="text-slate-500">Date :</span>
                                    <span>{{ date() | date:'dd/MM/yyyy' }}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-slate-500">Échéance :</span>
                                    <span>{{ dueDate() | date:'dd/MM/yyyy' }}</span>
                                </div>
                            </div>
                        </div>

                        <!-- Table -->
                        <div class="mt-12">
                            <table class="w-full text-left">
                                <thead>
                                    <tr class="border-b-2 border-slate-200">
                                        <th class="py-3 font-bold text-slate-700">Description</th>
                                        <th class="py-3 font-bold text-slate-700 text-right">Prix Unit.</th>
                                        <th class="py-3 font-bold text-slate-700 text-right">Qté</th>
                                        <th class="py-3 font-bold text-slate-700 text-right">Total</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-slate-100">
                                    @for (item of items(); track item.id) {
                                        <tr>
                                            <td class="py-3">{{ item.description || item.productName }}</td>
                                    <td class="py-3 text-right">{{ item.unitPrice | currency:currencyCode():'symbol':'1.2-2' }}</td>
                                            <td class="py-3 text-right">{{ item.quantity }}</td>
                                            <td class="py-3 text-right font-medium">{{ item.total | currency:currencyCode():'symbol':'1.2-2' }}</td>
                                        </tr>
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <!-- Footer / Totals -->
                    <div class="space-y-4">
                        <div class="flex justify-end pt-4 border-t border-slate-200">
                            <div class="w-1/2 space-y-2">
                                <div class="flex justify-between text-slate-600">
                                    <span>Sous-total HT</span>
                                    <span>{{ subtotal() | currency:currencyCode():'symbol':'1.2-2' }}</span>
                                </div>
                                <div class="flex justify-between text-slate-600">
                                    <span>TVA</span>
                                    <span>{{ taxTotal() | currency:currencyCode():'symbol':'1.2-2' }}</span>
                                </div>
                                <div class="flex justify-between text-base font-bold text-black pt-2 border-t border-slate-200">
                                    <span>Total TTC</span>
                                    <span>{{ total() | currency:currencyCode():'symbol':'1.2-2' }}</span>
                                </div>
                            </div>
                        </div>

                        <div class="text-center text-slate-400 text-xs pt-8 border-t border-slate-100">
                            Merci de votre confiance. Paiement dû sous 30 jours.
                        </div>
                    </div>
                </div>
             </div>

             <!-- Actions Sidebar -->
             <div class="lg:w-80 space-y-6">
                 <div class="rounded-lg border border-border p-6 bg-card sticky top-6">
                     <h3 class="text-lg font-medium mb-4">Actions</h3>
                     <p class="text-sm text-muted-foreground mb-6">Vérifiez les informations avant de valider la création de la facture.</p>
                     
                     <div class="space-y-3">
                         <button app-button variant="outline" class="w-full justify-start" (click)="previewPdf()">
                             <lucide-icon name="eye" class="mr-2 h-4 w-4"></lucide-icon>
                             Prévisualiser PDF
                         </button>
                         <button app-button variant="default" class="w-full justify-start" (click)="save()">
                             <lucide-icon name="circle-check" class="mr-2 h-4 w-4"></lucide-icon>
                             Valider et Créer
                         </button>
                     </div>
                 </div>
             </div>
         </div>
      }

      <!-- Navigation Footer -->
      <div class="flex justify-between pt-6 border-t border-border">
         <button app-button variant="outline" [disabled]="currentStep() === 1" (click)="prevStep()">Précédent</button>
         
         @if (currentStep() < 3) {
            <button app-button (click)="nextStep()" [disabled]="!isStepValid()">Suivant</button>
         } @else {
            <button app-button (click)="save()">{{ isEditing() ? 'Mettre à jour' : 'Créer la facture' }}</button>
         }
      </div>
    </div>
  `
})
export class CreateInvoiceComponent {
  router = inject(Router);
  route = inject(ActivatedRoute);
  invoiceService = inject(InvoiceService);
  clientService = inject(ClientService);
  productService = inject(ProductService);
  pdfService = inject(PdfService);
  companyService = inject(CompanyService);

  clients = this.clientService.getClients();
  products = this.productService.getProducts();

  currentStep = signal(1);
  isEditing = signal(false);
  invoiceId = signal<string | null>(null);

  selectedClientId = signal<number | null>(null);
  date = signal(new Date());
  dueDate = signal(new Date(new Date().setDate(new Date().getDate() + 30)));

  items = signal<InvoiceItem[]>([]);

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditing.set(true);
      this.invoiceId.set(id);
      this.loadInvoice(id);
    }
  }

  loadInvoice(id: string) {
    this.invoiceService.getInvoice(id).subscribe(invoice => {
      if (invoice) {
        this.selectedClientId.set(invoice.clientId);
        this.date.set(new Date(invoice.date));
        this.dueDate.set(new Date(invoice.dueDate));
        this.items.set(invoice.items);
      }
    });
  }

  currencyCode = computed(() => this.companyService.currentSettings().currency);

  subtotal = computed(() => this.items().reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0));
  taxTotal = computed(() => this.items().reduce((acc, item) => acc + (item.quantity * item.unitPrice * (item.taxRate / 100)), 0));
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
      taxRate: this.companyService.currentSettings().taxRate,
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

  nextStep() {
    if (this.currentStep() < 3) this.currentStep.update(s => s + 1);
  }

  prevStep() {
    if (this.currentStep() > 1) this.currentStep.update(s => s - 1);
  }

  isStepValid(): boolean {
    if (this.currentStep() === 1) return this.selectedClientId() !== null;
    if (this.currentStep() === 2) return this.items().length > 0;
    return true;
  }

  getTempInvoiceObject(): Invoice {
    const selectedClient = this.clients().find(c => c.id === this.selectedClientId());
    return {
      id: 'PREVIEW',
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
  }

  previewPdf() {
    this.pdfService.generateInvoicePdf(this.getTempInvoiceObject(), 'print');
  }

  save() {
    if (this.isEditing() && this.invoiceId()) {
      const invoice: Invoice = {
        ...this.getTempInvoiceObject(),
        id: this.invoiceId()!
      };
      this.invoiceService.updateInvoice(invoice);
      this.router.navigate(['/invoices', this.invoiceId()]);
    } else {
      const invoice = {
        ...this.getTempInvoiceObject(),
        id: `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`
      };
      this.invoiceService.addInvoice(invoice);
      this.router.navigate(['/invoices']);
    }
  }
}


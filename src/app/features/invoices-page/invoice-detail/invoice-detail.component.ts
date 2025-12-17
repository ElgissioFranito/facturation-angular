import { Component, inject, input, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { LucideAngularModule } from 'lucide-angular';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { Invoice } from '../../../shared/models/invoice.model';
import { PdfService } from '../../../core/services/utils/pdf.service';
import { InvoiceService } from '../../../core/services/api/invoice.service';
import { CompanyService } from '../../../core/services/api/company.service';

@Component({
    selector: 'app-invoice-detail',
    standalone: true,
    imports: [CommonModule, LucideAngularModule, ButtonComponent, CurrencyPipe, DatePipe],
    template: `
    <div class="flex flex-col gap-6 relative">
      <div class="flex items-center gap-4">
        <button app-button variant="outline" size="icon" (click)="back()">
          <lucide-icon name="arrow-left" class="h-4 w-4"></lucide-icon>
        </button>
        <h2 class="text-3xl font-bold tracking-tight">Facture {{ invoice()?.id }}</h2>
      </div>

      @if (invoice(); as inv) {
         <div class="flex flex-col lg:flex-row gap-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
             
             <!-- Document Preview (Same as Create Invoice Step 3) -->
             <div class="flex-1 overflow-auto bg-muted/30 p-2 md:p-4 rounded-lg flex justify-center">
                <div class="bg-white text-black p-4 md:p-8 shadow-lg max-w-[210mm] min-w-96 w-full flex flex-col justify-between text-sm" style="aspect-ratio: 210/297;">
                    <!-- Header -->
                    <div class="space-y-6">
                        <div class="flex justify-between items-start">
                            <div>
                                <h1 class="text-3xl font-bold text-slate-900 tracking-tight">FACTURE</h1>
                                <p class="mt-1" [class.text-green-600]="inv.status === 'paid'" [class.text-orange-500]="inv.status === 'pending'" [class.text-red-500]="inv.status === 'overdue'">
                                    {{ inv.status | uppercase }}
                                </p>
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
                                    <div class="font-medium text-black">{{ inv.clientName }}</div>
                                    <div>{{ inv.clientEmail }}</div>
                                    <div class="whitespace-pre-line">{{ inv.clientAddress }}</div>
                                </div>
                            </div>
                            <div class="text-right space-y-1">
                                <div class="flex justify-between">
                                    <span class="text-slate-500">N° Facture :</span>
                                    <span>{{ inv.id }}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-slate-500">Date :</span>
                                    <span>{{ inv.date | date:'dd/MM/yyyy' }}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-slate-500">Échéance :</span>
                                    <span>{{ inv.dueDate | date:'dd/MM/yyyy' }}</span>
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
                                    @for (item of inv.items; track item.id) {
                                        <tr>
                                            <td class="py-3">{{ item.description || item.productName }}</td>
                                            <td class="py-3 text-right">{{ item.unitPrice | currency:currencyCode():'symbol':'1.2-2' }}</td>
                                            <td class="py-3 text-right">{{ item.quantity }}</td>
                                            <td class="py-3 text-right font-medium">{{ item.unitPrice * item.quantity | currency:currencyCode():'symbol':'1.2-2' }}</td>
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
                                    <span>{{ inv.subtotal | currency:currencyCode():'symbol':'1.2-2' }}</span>
                                </div>
                                <div class="flex justify-between text-slate-600">
                                    <span>TVA</span>
                                    <span>{{ inv.taxTotal | currency:currencyCode():'symbol':'1.2-2' }}</span>
                                </div>
                                <div class="flex justify-between text-base font-bold text-black pt-2 border-t border-slate-200">
                                    <span>Total TTC</span>
                                    <span>{{ inv.total | currency:currencyCode():'symbol':'1.2-2' }}</span>
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
                     
                     <div class="space-y-3">
                         <button app-button variant="outline" class="w-full justify-start" (click)="downloadPdf(inv)">
                             <lucide-icon name="download" class="mr-2 h-4 w-4"></lucide-icon>
                             Télécharger PDF
                         </button>
                         <button app-button variant="outline" class="w-full justify-start" (click)="printInvoice(inv)">
                             <lucide-icon name="printer" class="mr-2 h-4 w-4"></lucide-icon>
                             Imprimer
                         </button>
                         <button app-button variant="outline" class="w-full justify-start" (click)="duplicate(inv)">
                             <lucide-icon name="copy" class="mr-2 h-4 w-4"></lucide-icon>
                             Dupliquer
                         </button>
                          <div class="h-px bg-border my-2"></div>

                          <button app-button variant="outline" class="w-full justify-start" (click)="editInvoice()">
                              <lucide-icon name="edit" class="mr-2 h-4 w-4"></lucide-icon>
                              Modifier
                          </button>
                          <button app-button variant="outline" class="w-full justify-start text-destructive hover:bg-destructive/10 hover:text-destructive" (click)="deleteInvoice(inv)">
                              <lucide-icon name="trash-2" class="mr-2 h-4 w-4"></lucide-icon>
                              Supprimer
                          </button>
                          
                          @if (inv.status !== 'paid') {
                           <div class="h-px bg-border my-2"></div>
                           <button app-button variant="default" class="w-full justify-start bg-success hover:bg-success/90 text-white" (click)="markAsPaid(inv)">
                               <lucide-icon name="circle-check" class="mr-2 h-4 w-4"></lucide-icon>
                               Marquer payée
                           </button>
                          }
                     </div>
                 </div>
             </div>
         </div>
      }
    </div>
  `
})
export class InvoiceDetailComponent {
    private route = inject(ActivatedRoute);

    id = toSignal(this.route.paramMap.pipe(
        map(params => params.get('id') || '')
    ), { initialValue: '' });

    private invoiceService = inject(InvoiceService);
    private pdfService = inject(PdfService);
    private router = inject(Router);
    private companyService = inject(CompanyService);

    currencyCode = computed(() => this.companyService.currentSettings().currency);

    // Get all invoices logic (mock) - ideally we fetch one by ID, but for now filtering list is fine
    private invoices = this.invoiceService.getInvoices();

    invoice = computed(() => {
        const id = this.id();
        return this.invoices().find(i => i.id === id);
    });

    back() {
        this.router.navigate(['/invoices']);
    }

    downloadPdf(inv: Invoice) {
        this.pdfService.generateInvoicePdf(inv, 'download');
    }

    printInvoice(inv: Invoice) {
        this.pdfService.generateInvoicePdf(inv, 'print');
    }

    duplicate(inv: Invoice) {
        const newInvoice: Invoice = {
            ...inv,
            id: `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`,
            date: new Date(),
            dueDate: new Date(new Date().setDate(new Date().getDate() + 30)),
            status: 'pending'
        };
        this.invoiceService.addInvoice(newInvoice);
        this.router.navigate(['/invoices']);
    }

    editInvoice() {
        const id = this.id();
        if (id) {
            this.router.navigate(['/invoices/edit', id]);
        }
    }

    deleteInvoice(inv: Invoice) {
        if (confirm('Êtes-vous sûr de vouloir supprimer cette facture ? Cette action est irréversible.')) {
            this.invoiceService.deleteInvoice(inv.id).subscribe(() => {
                this.router.navigate(['/invoices']);
            });
        }
    }

    markAsPaid(inv: Invoice) {
        this.invoiceService.updateInvoice({ ...inv, status: 'paid' });
    }
}

import { Component, inject, computed } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { InvoiceService } from '../../../../core/services/api/invoice.service';
import { CompanyService } from '../../../../core/services/api/company.service';

@Component({
  selector: 'app-recent-activity',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  template: `
    <div class="space-y-8">
      @for (invoice of recentInvoices(); track invoice.id) {
        <div class="flex items-center">
          <div class="relative h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
             <div class="h-4 w-4 rounded-full bg-primary"></div>
          </div>
          <div class="ml-4 space-y-1">
            <p class="text-sm font-medium leading-none">{{ invoice.clientName }}</p>
            <p class="text-sm text-muted-foreground">{{ invoice.id }}</p>
          </div>
          <div class="ml-auto font-medium">
            +{{ invoice.total | currency:currencyCode():'symbol':'1.0-0' }}
          </div>
        </div>
      }
      @if (recentInvoices().length === 0) {
        <div class="text-center text-sm text-muted-foreground">Aucune activité récente.</div>
      }
    </div>
  `
})
export class RecentActivityComponent {
  invoiceService = inject(InvoiceService);
  companyService = inject(CompanyService);
  currencyCode = computed(() => this.companyService.currentSettings().currency);

  invoices = this.invoiceService.getInvoices();

  recentInvoices = computed(() => {
    return this.invoices()
      .slice(0, 5); // Just take the first 5 for now
  });
}

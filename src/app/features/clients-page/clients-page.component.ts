import { Component, inject, signal, computed } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { ClientService } from '../../core/services/api/client.service';
import { Client } from '../../shared/models/client.model';
import { TableComponent, TableHeaderComponent, TableBodyComponent, TableRowComponent, TableHeadComponent, TableCellComponent } from '../../shared/components/ui/table/table.component';
import { ButtonComponent } from '../../shared/components/ui/button/button.component';
import { InputComponent } from '../../shared/components/ui/input/input.component';
import { ClientDialogComponent } from './components/client-dialog/client-dialog.component';

@Component({
  selector: 'app-clients-page',
  standalone: true,
  imports: [
    TableComponent, TableHeaderComponent, TableBodyComponent, TableRowComponent, TableHeadComponent, TableCellComponent,
    ButtonComponent, InputComponent, ClientDialogComponent,
    LucideAngularModule, CurrencyPipe
  ],
  template: `
    <div class="space-y-6">
      <app-client-dialog [open]="dialogOpen()" (openChange)="dialogOpen.set($event)" [client]="selectedClient()"></app-client-dialog>

      <div class="flex items-center justify-between">
        <div>
           <h2 class="text-3xl font-bold tracking-tight">Clients</h2>
           <p class="text-muted-foreground">Gestion de vos clients.</p>
        </div>
        <button app-button (click)="openAddDialog()">
          <lucide-icon name="plus" class="mr-2 h-4 w-4"></lucide-icon>
          Ajouter un client
        </button>
      </div>

      <div class="flex items-center py-4">
        <input app-input placeholder="Filtrer par nom..." class="max-w-sm" (input)="filter($event)" />
      </div>

      <div class="rounded-md border border-border">
        <app-table>
          <app-table-header>
            <app-table-row>
              <app-table-head>Nom</app-table-head>
              <app-table-head>Email</app-table-head>
              <app-table-head>Téléphone</app-table-head>
              <app-table-head>Statut</app-table-head>
              <app-table-head class="text-right">Total Facturé</app-table-head>
              <app-table-head class="w-[50px]"></app-table-head>
            </app-table-row>
          </app-table-header>
          <app-table-body>
            @for (client of filteredClients(); track client.id) {
              <app-table-row>
                <app-table-cell class="font-medium">{{ client.name }}</app-table-cell>
                <app-table-cell>{{ client.email }}</app-table-cell>
                <app-table-cell>{{ client.phone }}</app-table-cell>
                <app-table-cell>
                  <span [class]="getStatusClass(client.status)">
                    {{ client.status }}
                  </span>
                </app-table-cell>
                <app-table-cell class="text-right">{{ client.totalInvoiced | currency:'EUR' }}</app-table-cell>
                <app-table-cell>
                  <button app-button variant="ghost" size="icon" (click)="editClient(client)">
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
export class ClientsPageComponent {
  clientService = inject(ClientService);
  clients = this.clientService.getClients();
  filterText = signal('');

  filteredClients = computed(() => {
    const text = this.filterText().toLowerCase();
    return this.clients().filter(c =>
      c.name.toLowerCase().includes(text) ||
      c.email.toLowerCase().includes(text)
    );
  });

  dialogOpen = signal(false);
  selectedClient = signal<Partial<Client>>({});

  filter(event: Event) {
    const input = event.target as HTMLInputElement;
    this.filterText.set(input.value);
  }

  getStatusClass(status: string) {
    return status === 'active'
      ? 'inline-flex items-center rounded-full border border-transparent bg-success/10 px-2.5 py-0.5 text-xs font-semibold text-success transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
      : 'inline-flex items-center rounded-full border border-transparent bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2';
  }

  openAddDialog() {
    this.selectedClient.set({});
    this.dialogOpen.set(true);
  }

  editClient(client: Client) {
    this.selectedClient.set({ ...client });
    this.dialogOpen.set(true);
  }
}

import { Component, inject, signal, computed } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { ProductService } from '../../core/services/api/product.service';
import { Product } from '../../shared/models/product.model';
import { TableComponent, TableHeaderComponent, TableBodyComponent, TableRowComponent, TableHeadComponent, TableCellComponent } from '../../shared/components/ui/table/table.component';
import { ButtonComponent } from '../../shared/components/ui/button/button.component';
import { InputComponent } from '../../shared/components/ui/input/input.component';
import { ProductDialogComponent } from './components/product-dialog/product-dialog.component';
import { CompanyService } from '../../core/services/api/company.service';

@Component({
  selector: 'app-products-page',
  standalone: true,
  imports: [
    TableComponent, TableHeaderComponent, TableBodyComponent, TableRowComponent, TableHeadComponent, TableCellComponent,
    ButtonComponent, InputComponent, ProductDialogComponent,
    LucideAngularModule, CurrencyPipe
  ],
  template: `
    <div class="space-y-6">
      <app-product-dialog [open]="dialogOpen()" (openChange)="dialogOpen.set($event)" [product]="selectedProduct()"></app-product-dialog>

      <div class="flex items-center justify-between">
        <div>
           <h2 class="text-3xl font-bold tracking-tight">Services & Produits</h2>
           <p class="text-muted-foreground">Gérez votre catalogue de prestations.</p>
        </div>
        <button app-button (click)="openAddDialog()">
          <lucide-icon name="plus" class="mr-2 h-4 w-4"></lucide-icon>
          Ajouter un service
        </button>
      </div>

      <div class="flex items-center py-4">
        <input app-input placeholder="Filtrer par nom..." class="max-w-sm" (input)="filter($event)" />
      </div>

      <div class="rounded-md border border-border">
        <app-table>
          <thead app-table-header>
            <tr app-table-row>
              <th app-table-head>Nom</th>
              <th app-table-head>Description</th>
              <th app-table-head class="text-right">Tarif</th>
              <th app-table-head class="text-right">TVA (%)</th>
              <th app-table-head class="w-[50px]"></th>
            </tr>
          </thead>
          <tbody app-table-body>
            @for (product of filteredProducts(); track product.id) {
              <tr app-table-row>
                <td app-table-cell class="font-medium">{{ product.name }}</td>
                <td app-table-cell class="text-muted-foreground">{{ product.description }}</td>
                <td app-table-cell class="text-right">
                  {{ product.rate | currency:currencyCode():'symbol':'1.2-2' }} / {{ product.unit }}
                </td>
                <td app-table-cell class="text-right">{{ product.taxRate }}%</td>
                <td app-table-cell>
                  <button app-button variant="ghost" size="icon" (click)="editProduct(product)">
                    <lucide-icon name="settings" class="h-4 w-4"></lucide-icon>
                  </button>
                  <button app-button variant="ghost" size="icon" class="text-destructive hover:bg-destructive/10" (click)="deleteProduct(product.id)">
                    <lucide-icon name="trash-2" class="h-4 w-4"></lucide-icon>
                  </button>
                </td>
              </tr>
            }
          </tbody>
        </app-table>
      </div>
    </div>
  `
})
export class ProductsPageComponent {
  productService = inject(ProductService);
  companyService = inject(CompanyService);
  currencyCode = computed(() => this.companyService.currentSettings().currency);

  products = this.productService.getProducts();
  filterText = signal('');

  filteredProducts = computed(() => {
    const text = this.filterText().toLowerCase();
    return this.products().filter(p =>
      p.name.toLowerCase().includes(text) ||
      p.description.toLowerCase().includes(text)
    );
  });

  dialogOpen = signal(false);
  selectedProduct = signal<Partial<Product>>({});

  filter(event: Event) {
    const input = event.target as HTMLInputElement;
    this.filterText.set(input.value);
  }

  openAddDialog() {
    this.selectedProduct.set({});
    this.dialogOpen.set(true);
  }

  editProduct(product: Product) {
    this.selectedProduct.set({ ...product });
    this.dialogOpen.set(true);
  }

  deleteProduct(id: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce service/produit ?')) {
      this.productService.deleteProduct(id);
    }
  }
}

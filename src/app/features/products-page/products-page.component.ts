import { Component, inject, signal, computed } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { ProductService } from '../../core/services/api/product.service';
import { Product } from '../../shared/models/product.model';
import { TableComponent, TableHeaderComponent, TableBodyComponent, TableRowComponent, TableHeadComponent, TableCellComponent } from '../../shared/components/ui/table/table.component';
import { ButtonComponent } from '../../shared/components/ui/button/button.component';
import { InputComponent } from '../../shared/components/ui/input/input.component';
import { ProductDialogComponent } from './components/product-dialog/product-dialog.component';

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
          <app-table-header>
            <app-table-row>
              <app-table-head>Nom</app-table-head>
              <app-table-head>Description</app-table-head>
              <app-table-head class="text-right">Tarif</app-table-head>
              <app-table-head class="text-right">TVA (%)</app-table-head>
              <app-table-head class="w-[50px]"></app-table-head>
            </app-table-row>
          </app-table-header>
          <app-table-body>
            @for (product of filteredProducts(); track product.id) {
              <app-table-row>
                <app-table-cell class="font-medium">{{ product.name }}</app-table-cell>
                <app-table-cell class="text-muted-foreground">{{ product.description }}</app-table-cell>
                <app-table-cell class="text-right">
                  {{ product.rate | currency:'EUR' }} / {{ product.unit }}
                </app-table-cell>
                <app-table-cell class="text-right">{{ product.taxRate }}%</app-table-cell>
                <app-table-cell>
                  <button app-button variant="ghost" size="icon" (click)="editProduct(product)">
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
export class ProductsPageComponent {
  productService = inject(ProductService);
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
}

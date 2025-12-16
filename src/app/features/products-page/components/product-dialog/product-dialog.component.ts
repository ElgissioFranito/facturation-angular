import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../../core/services/api/product.service';
import { Product } from '../../../../shared/models/product.model';
import { DialogComponent, DialogContentComponent, DialogHeaderComponent, DialogFooterComponent, DialogTitleComponent, DialogDescriptionComponent } from '../../../../shared/components/ui/dialog/dialog.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { InputComponent } from '../../../../shared/components/ui/input/input.component';
import { LabelComponent } from '../../../../shared/components/ui/label/label.component';

@Component({
    selector: 'app-product-dialog',
    standalone: true,
    imports: [
        DialogComponent, DialogContentComponent, DialogHeaderComponent, DialogFooterComponent, DialogTitleComponent, DialogDescriptionComponent,
        ButtonComponent, InputComponent, LabelComponent,
        FormsModule
    ],
    template: `
    <app-dialog [open]="open" (openChange)="openChange.emit($event)">
      <app-dialog-content>
        <app-dialog-header>
          <app-dialog-title>{{ isEditing ? 'Modifier Service/Produit' : 'Ajouter Service/Produit' }}</app-dialog-title>
          <app-dialog-description>
            {{ isEditing ? 'Modifiez les détails du service.' : 'Ajoutez un nouveau service à votre catalogue.' }}
          </app-dialog-description>
        </app-dialog-header>

        <div class="grid gap-4 py-4">
          <div class="grid grid-cols-4 items-center gap-4">
            <label app-label class="text-right">Nom</label>
            <input app-input [(ngModel)]="product.name" class="col-span-3" />
          </div>
          <div class="grid grid-cols-4 items-center gap-4">
            <label app-label class="text-right">Description</label>
            <input app-input [(ngModel)]="product.description" class="col-span-3" />
          </div>
          <div class="grid grid-cols-4 items-center gap-4">
            <label app-label class="text-right">Tarif (€)</label>
            <input app-input type="number" [(ngModel)]="product.rate" class="col-span-3" />
          </div>
           <div class="grid grid-cols-4 items-center gap-4">
            <label app-label class="text-right">Unité</label>
             <div class="col-span-3">
               <input app-input [(ngModel)]="product.unit" placeholder="ex: day, hour, month" />
             </div>
          </div>
        </div>

        <app-dialog-footer>
          <button app-button type="submit" (click)="save()">Sauvegarder</button>
        </app-dialog-footer>
      </app-dialog-content>
    </app-dialog>
  `
})
export class ProductDialogComponent {
    @Input() open = false;
    @Output() openChange = new EventEmitter<boolean>();
    @Input() product: Partial<Product> = {};

    productService = inject(ProductService);

    get isEditing() {
        return !!this.product.id;
    }

    save() {
        if (this.isEditing) {
            this.productService.updateProduct(this.product as Product);
        } else {
            this.productService.addProduct(this.product as Product);
        }
        this.open = false;
        this.openChange.emit(false);
    }
}

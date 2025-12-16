import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { ReceiptService } from '../../../../core/services/api/receipt.service';
import { Receipt } from '../../../../shared/models/receipt.model';
import { DialogComponent, DialogContentComponent, DialogHeaderComponent, DialogFooterComponent, DialogTitleComponent, DialogDescriptionComponent } from '../../../../shared/components/ui/dialog/dialog.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { InputComponent } from '../../../../shared/components/ui/input/input.component';
import { LabelComponent } from '../../../../shared/components/ui/label/label.component';

@Component({
    selector: 'app-receipt-dialog',
    standalone: true,
    imports: [
        CommonModule,
        DialogComponent, DialogContentComponent, DialogHeaderComponent, DialogFooterComponent, DialogTitleComponent, DialogDescriptionComponent,
        ButtonComponent, InputComponent, LabelComponent,
        FormsModule, DatePipe
    ],
    template: `
    <app-dialog [open]="open" (openChange)="openChange.emit($event)">
      <app-dialog-content class="sm:max-w-[500px]">
        <app-dialog-header>
          <app-dialog-title>{{ isEditing ? 'Modifier Reçu' : 'Ajouter un Reçu' }}</app-dialog-title>
          <app-dialog-description>
            {{ isEditing ? 'Modifiez les détails du reçu.' : 'Ajoutez une nouvelle dépense à votre comptabilité.' }}
          </app-dialog-description>
        </app-dialog-header>

        <div class="grid gap-4 py-4">
          <div class="grid grid-cols-4 items-center gap-4">
            <label app-label class="text-right">Date</label>
            <input app-input type="date" [ngModel]="receipt.date | date:'yyyy-MM-dd'" (ngModelChange)="updateDate($event)" class="col-span-3" />
          </div>
          <div class="grid grid-cols-4 items-center gap-4">
            <label app-label class="text-right">Marchand</label>
            <input app-input [(ngModel)]="receipt.merchant" class="col-span-3" placeholder="ex: Amazon, Uber..." />
          </div>
           <div class="grid grid-cols-4 items-center gap-4">
            <label app-label class="text-right">Catégorie</label>
            <input app-input [(ngModel)]="receipt.category" class="col-span-3" placeholder="ex: Équipement, Transport..." />
          </div>
          <div class="grid grid-cols-4 items-center gap-4">
            <label app-label class="text-right">Montant (€)</label>
            <input app-input type="number" [(ngModel)]="receipt.amount" class="col-span-3" />
          </div>
           <div class="grid grid-cols-4 items-center gap-4">
            <label app-label class="text-right">Description</label>
            <input app-input [(ngModel)]="receipt.description" class="col-span-3" placeholder="Information complémentaire..." />
          </div>
        </div>

        <app-dialog-footer>
          <button app-button type="submit" (click)="save()">Sauvegarder</button>
        </app-dialog-footer>
      </app-dialog-content>
    </app-dialog>
  `
})
export class ReceiptDialogComponent {
    @Input() open = false;
    @Output() openChange = new EventEmitter<boolean>();
    @Input() receipt: Partial<Receipt> = {};

    receiptService = inject(ReceiptService);

    get isEditing() {
        return !!this.receipt.id;
    }

    updateDate(dateString: string) {
        this.receipt.date = new Date(dateString);
    }

    save() {
        // Ensure defaults
        if (!this.receipt.status) this.receipt.status = 'pending';
        if (!this.receipt.id) this.receipt.id = 'REC-' + Date.now();
        if (!this.receipt.date) this.receipt.date = new Date();

        if (this.isEditing) {
            this.receiptService.updateReceipt(this.receipt as Receipt);
        } else {
            this.receiptService.addReceipt(this.receipt as Receipt);
        }
        this.open = false;
        this.openChange.emit(false);
    }
}

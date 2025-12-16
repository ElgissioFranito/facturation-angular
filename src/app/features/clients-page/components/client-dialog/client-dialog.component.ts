import { Component, EventEmitter, Input, Output, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClientService } from '../../../../core/services/api/client.service';
import { Client } from '../../../../shared/models/client.model';
import { DialogComponent, DialogContentComponent, DialogHeaderComponent, DialogFooterComponent, DialogTitleComponent, DialogDescriptionComponent } from '../../../../shared/components/ui/dialog/dialog.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { InputComponent } from '../../../../shared/components/ui/input/input.component';
import { LabelComponent } from '../../../../shared/components/ui/label/label.component';

@Component({
    selector: 'app-client-dialog',
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
          <app-dialog-title>{{ isEditing ? 'Modifier Client' : 'Ajouter Client' }}</app-dialog-title>
          <app-dialog-description>
            {{ isEditing ? 'Modifiez les informations du client ici.' : 'Ajoutez un nouveau client à votre base de données.' }}
          </app-dialog-description>
        </app-dialog-header>

        <div class="grid gap-4 py-4">
          <div class="grid grid-cols-4 items-center gap-4">
            <label app-label class="text-right">Nom</label>
            <input app-input [(ngModel)]="client.name" class="col-span-3" />
          </div>
          <div class="grid grid-cols-4 items-center gap-4">
            <label app-label class="text-right">Email</label>
            <input app-input [(ngModel)]="client.email" class="col-span-3" type="email" />
          </div>
          <div class="grid grid-cols-4 items-center gap-4">
            <label app-label class="text-right">Téléphone</label>
            <input app-input [(ngModel)]="client.phone" class="col-span-3" />
          </div>
           <div class="grid grid-cols-4 items-center gap-4">
            <label app-label class="text-right">Adresse</label>
            <input app-input [(ngModel)]="client.address" class="col-span-3" />
          </div>
        </div>

        <app-dialog-footer>
          <button app-button type="submit" (click)="save()">Sauvegarder</button>
        </app-dialog-footer>
      </app-dialog-content>
    </app-dialog>
  `
})
export class ClientDialogComponent {
    @Input() open = false;
    @Output() openChange = new EventEmitter<boolean>();
    @Input() client: Partial<Client> = {};

    clientService = inject(ClientService);

    get isEditing() {
        return !!this.client.id;
    }

    save() {
        if (this.isEditing) {
            this.clientService.updateClient(this.client as Client);
        } else {
            this.clientService.addClient(this.client as Client);
        }
        this.open = false;
        this.openChange.emit(false);
    }
}

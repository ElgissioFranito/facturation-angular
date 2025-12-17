import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { ButtonComponent } from '../../shared/components/ui/button/button.component';
import { InputComponent } from '../../shared/components/ui/input/input.component';
import { LabelComponent } from '../../shared/components/ui/label/label.component';
import { CardComponent, CardHeaderComponent, CardTitleComponent, CardContentComponent, CardDescriptionComponent } from '../../shared/components/ui/card/card.component';
import { AuthService } from '../../core/services/auth/auth.service';
import { CompanyService } from '../../core/services/api/company.service';
import { LayoutService } from '../../core/services/ui/layout.service';

@Component({
  selector: 'app-settings-page',
  standalone: true,
  imports: [
    CommonModule, FormsModule, LucideAngularModule,
    ButtonComponent, InputComponent, LabelComponent,
    CardComponent, CardHeaderComponent, CardTitleComponent, CardContentComponent, CardDescriptionComponent
  ],
  template: `
    <div class="flex flex-col gap-6">
      <div>
        <h2 class="text-3xl font-bold tracking-tight">Paramètres</h2>
        <p class="text-muted-foreground">Gérez vos préférences et informations de profil.</p>
      </div>

      <app-card>
        <app-card-header>
          <app-card-title>Profil Utilisateur</app-card-title>
          <app-card-description>Vos informations personnelles.</app-card-description>
        </app-card-header>
        <app-card-content class="space-y-4">
          <div class="grid grid-cols-4 items-center gap-4">
            <label app-label class="text-right">Nom</label>
            <input app-input [(ngModel)]="user.name" class="col-span-3" />
          </div>
          <div class="grid grid-cols-4 items-center gap-4">
            <label app-label class="text-right">Email</label>
            <input app-input [(ngModel)]="user.email" type="email" class="col-span-3" readonly />
          </div>
           <div class="flex justify-end">
            <button app-button (click)="save()">Enregistrer</button>
          </div>
        </app-card-content>
      </app-card>
       
      <app-card>
        <app-card-header>
          <app-card-title>Informations Entreprise</app-card-title>
          <app-card-description>Coordonnées et préférences de facturation.</app-card-description>
        </app-card-header>
        <app-card-content class="space-y-4">
           <!-- Logo Upload -->
           <div class="grid grid-cols-4 items-center gap-4">
              <label app-label class="text-right">Logo</label>
              <div class="col-span-3 flex items-center gap-4">
                  @if (settings.logo) {
                      <div class="h-16 w-16 border rounded bg-muted flex items-center justify-center overflow-hidden">
                          <img [src]="settings.logo" class="h-full w-full object-contain" />
                      </div>
                      <button app-button variant="ghost" size="sm" (click)="updateSetting('logo', null)">Supprimer</button>
                  } @else {
                      <div class="h-16 w-16 border rounded bg-muted flex items-center justify-center text-muted-foreground">
                          <lucide-icon name="image" class="h-6 w-6"></lucide-icon>
                      </div>
                  }
                  <input type="file" (change)="onFileSelected($event, 'logo')" accept="image/*" class="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90" />
              </div>
           </div>

           <!-- Cachet Upload -->
           <div class="grid grid-cols-4 items-center gap-4">
              <label app-label class="text-right">Cachet (Tampon)</label>
              <div class="col-span-3 flex items-center gap-4">
                  @if (settings.stamp) {
                      <div class="h-16 w-16 border rounded bg-muted flex items-center justify-center overflow-hidden">
                          <img [src]="settings.stamp" class="h-full w-full object-contain" />
                      </div>
                      <button app-button variant="ghost" size="sm" (click)="updateSetting('stamp', null)">Supprimer</button>
                  } @else {
                      <div class="h-16 w-16 border rounded bg-muted flex items-center justify-center text-muted-foreground">
                          <lucide-icon name="stamp" class="h-6 w-6"></lucide-icon>
                      </div>
                  }
                  <input type="file" (change)="onFileSelected($event, 'stamp')" accept="image/*" class="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90" />
              </div>
           </div>

           <!-- Signature Upload -->
           <div class="grid grid-cols-4 items-center gap-4">
              <label app-label class="text-right">Signature</label>
              <div class="col-span-3 flex items-center gap-4">
                  @if (settings.signature) {
                      <div class="h-16 w-16 border rounded bg-muted flex items-center justify-center overflow-hidden">
                          <img [src]="settings.signature" class="h-full w-full object-contain" />
                      </div>
                      <button app-button variant="ghost" size="sm" (click)="updateSetting('signature', null)">Supprimer</button>
                  } @else {
                      <div class="h-16 w-16 border rounded bg-muted flex items-center justify-center text-muted-foreground">
                          <lucide-icon name="pen-tool" class="h-6 w-6"></lucide-icon>
                      </div>
                  }
                  <input type="file" (change)="onFileSelected($event, 'signature')" accept="image/*" class="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90" />
              </div>
           </div>

           <!-- Company Details -->
           <div class="grid grid-cols-4 items-center gap-4">
             <label app-label class="text-right">Nom Entreprise</label>
             <input app-input [ngModel]="settings.name" (ngModelChange)="updateSetting('name', $event)" class="col-span-3" />
           </div>
           
           <div class="grid grid-cols-4 items-center gap-4">
             <label app-label class="text-right">Email Contact</label>
             <input app-input [ngModel]="settings.email" (ngModelChange)="updateSetting('email', $event)" class="col-span-3" />
           </div>

           <div class="grid grid-cols-4 items-center gap-4">
             <label app-label class="text-right">Adresse</label>
             <textarea class="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 col-span-3"
                 [ngModel]="settings.address" (ngModelChange)="updateSetting('address', $event)"></textarea>
           </div>

           <!-- Currency -->
           <div class="grid grid-cols-4 items-center gap-4">
             <label app-label class="text-right">Devise</label>
             <select [ngModel]="settings.currency" (ngModelChange)="updateSetting('currency', $event)" class="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                <option value="MGA">Ariary (MGA)</option>
                <option value="EUR">Euro (€)</option>
                <option value="USD">Dollar US ($)</option>
                <option value="GBP">Livre Sterling (£)</option>
             </select>
           </div>

           <!-- Tax Rate -->
           <div class="grid grid-cols-4 items-center gap-4">
             <label app-label class="text-right">TVA par défaut (%)</label>
             <input app-input type="number" [ngModel]="settings.taxRate" (ngModelChange)="updateSetting('taxRate', $event)" class="col-span-3" />
           </div>
        </app-card-content>
      </app-card>

      <app-card>
        <app-card-header>
          <app-card-title>Préférences de l'application</app-card-title>
          <app-card-description>Personnalisez votre expérience.</app-card-description>
        </app-card-header>
        <app-card-content>
           <div class="flex items-center justify-between">
              <div class="space-y-0.5">
                  <label class="text-base font-medium">Mode Sombre</label>
                  <p class="text-sm text-muted-foreground">Activez le thème sombre pour l'application.</p>
              </div>
              <button app-button variant="outline" size="icon" (click)="layoutService.toggleTheme()">
                  <lucide-icon [name]="layoutService.isDark() ? 'moon' : 'sun'" class="h-5 w-5"></lucide-icon>
              </button>
           </div>
        </app-card-content>
      </app-card>
    </div>
  `
})
export class SettingsPageComponent {
  authService = inject(AuthService);
  layoutService = inject(LayoutService);
  companyService = inject(CompanyService);

  user = { ...this.authService.currentUser()! };

  // Getter/Setter proxy not needed if we bind directly to a local object that syncs back, 
  // but to keep reactivity simple with the service:

  get settings() {
    return this.companyService.currentSettings();
  }

  save() {
    console.log('Saving settings...', this.user);
    alert('Paramètres sauvegardés (simulation)');
  }

  updateSetting(key: string, value: any) {
    this.companyService.updateSettings({ [key]: value });
  }

  onFileSelected(event: Event, key: 'logo' | 'stamp' | 'signature') {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.updateSetting(key, e.target.result);
      };
      reader.readAsDataURL(input.files[0]);
    }
  }
}

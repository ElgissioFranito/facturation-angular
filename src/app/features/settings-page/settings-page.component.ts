import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { ButtonComponent } from '../../shared/components/ui/button/button.component';
import { InputComponent } from '../../shared/components/ui/input/input.component';
import { LabelComponent } from '../../shared/components/ui/label/label.component';
import { CardComponent, CardHeaderComponent, CardTitleComponent, CardContentComponent, CardDescriptionComponent } from '../../shared/components/ui/card/card.component';
import { AuthService } from '../../core/services/auth/auth.service';

@Component({
  selector: 'app-settings-page',
  standalone: true,
  imports: [
    CommonModule, FormsModule, LucideAngularModule,
    ButtonComponent, InputComponent, LabelComponent,
    CardComponent, CardHeaderComponent, CardTitleComponent, CardContentComponent, CardDescriptionComponent
  ],
  template: `
    <div class="space-y-6">
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
           <app-card-title>Préférences de l'application</app-card-title>
           <app-card-description>Thème, notifications, etc. (À venir)</app-card-description>
        </app-card-header>
        <app-card-content>
           <p class="text-sm text-muted-foreground">Configuration bientôt disponible.</p>
        </app-card-content>
      </app-card>
    </div>
  `
})
export class SettingsPageComponent {
  authService = inject(AuthService);
  user = { ...this.authService.currentUser()! };

  save() {
    console.log('Saving settings...', this.user);
    // In a real app, update user via AuthService
    alert('Paramètres sauvegardés (simulation)');
  }
}

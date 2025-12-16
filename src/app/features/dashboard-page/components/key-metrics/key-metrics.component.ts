import { Component, Input } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { CardComponent, CardHeaderComponent, CardTitleComponent, CardContentComponent } from '../../../../shared/components/ui/card/card.component';
import { CurrencyPipe } from '@angular/common';

@Component({
    selector: 'app-key-metrics',
    standalone: true,
    imports: [CardComponent, CardHeaderComponent, CardTitleComponent, CardContentComponent, LucideAngularModule, CurrencyPipe],
    template: `
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <app-card>
        <app-card-header class="flex flex-row items-center justify-between space-y-0 pb-2">
          <app-card-title class="text-sm font-medium">Revenu Total (Mois)</app-card-title>
          <lucide-icon name="euro" class="h-4 w-4 text-muted-foreground"></lucide-icon>
        </app-card-header>
        <app-card-content>
          <div class="text-2xl font-bold">{{ metrics.totalMonth | currency:'EUR' }}</div>
          <p class="text-xs text-muted-foreground">+20.1% par rapport au mois dernier</p>
        </app-card-content>
      </app-card>

      <app-card>
        <app-card-header class="flex flex-row items-center justify-between space-y-0 pb-2">
          <app-card-title class="text-sm font-medium">Factures Payées</app-card-title>
          <lucide-icon name="check-circle" class="h-4 w-4 text-secondary"></lucide-icon>
        </app-card-header>
        <app-card-content>
          <div class="text-2xl font-bold">+{{ metrics.paidRange }}</div>
          <p class="text-xs text-muted-foreground">Sur les 30 derniers jours</p>
        </app-card-content>
      </app-card>

      <app-card>
        <app-card-header class="flex flex-row items-center justify-between space-y-0 pb-2">
          <app-card-title class="text-sm font-medium">En Attente</app-card-title>
          <lucide-icon name="clock" class="h-4 w-4 text-warning"></lucide-icon>
        </app-card-header>
        <app-card-content>
          <div class="text-2xl font-bold">{{ metrics.pendingRange }}</div>
          <p class="text-xs text-muted-foreground">Factures en attente de paiement</p>
        </app-card-content>
      </app-card>

      <app-card>
        <app-card-header class="flex flex-row items-center justify-between space-y-0 pb-2">
          <app-card-title class="text-sm font-medium">En Retard</app-card-title>
          <lucide-icon name="alert-circle" class="h-4 w-4 text-destructive"></lucide-icon>
        </app-card-header>
        <app-card-content>
          <div class="text-2xl font-bold">{{ metrics.overdueRange }}</div>
          <p class="text-xs text-muted-foreground">Nécessite une relance</p>
        </app-card-content>
      </app-card>
    </div>
  `
})
export class KeyMetricsComponent {
    @Input() metrics: any = {
        totalMonth: 0,
        paidRange: 0,
        pendingRange: 0,
        overdueRange: 0
    };
}

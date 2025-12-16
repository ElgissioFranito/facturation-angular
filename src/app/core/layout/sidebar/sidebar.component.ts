import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LucideAngularModule, LayoutDashboard, Users, FileText, Package, Receipt, Settings, LogOut } from 'lucide-angular';
import { AuthService } from '../../services/auth/auth.service';

@Component({
    selector: 'app-sidebar',
    imports: [RouterLink, RouterLinkActive, LucideAngularModule],
    standalone: true,
    template: `
    <div class="h-screen w-64 bg-card border-r border-border flex flex-col fixed left-0 top-0">
      <div class="p-6 border-b border-border">
        <h1 class="text-2xl font-bold text-primary flex items-center gap-2">
          <lucide-icon name="file-text" class="h-8 w-8 text-secondary"></lucide-icon>
          FreelanceIn
        </h1>
      </div>

      <nav class="flex-1 p-4 space-y-1 overflow-y-auto">
        @for (item of menuItems; track item.label) {
          <a [routerLink]="item.path" 
             routerLinkActive="bg-accent text-accent-foreground"
             class="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground transition-all duration-200">
            <lucide-icon [name]="item.icon" class="h-5 w-5"></lucide-icon>
            {{ item.label }}
          </a>
        }
      </nav>

      <div class="p-4 border-t border-border">
        <button (click)="authService.logout()" 
                class="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors">
          <lucide-icon name="log-out" class="h-5 w-5"></lucide-icon>
          Déconnexion
        </button>
      </div>
    </div>
  `
})
export class SidebarComponent {
    authService = inject(AuthService);

    menuItems = [
        { label: 'Tableau de bord', path: '/dashboard', icon: 'layout-dashboard' },
        { label: 'Clients', path: '/clients', icon: 'users' },
        { label: 'Factures', path: '/invoices', icon: 'file-text' },
        { label: 'Produits', path: '/products', icon: 'package' },
        { label: 'Reçus', path: '/receipts', icon: 'receipt' },
        { label: 'Paramètres', path: '/settings', icon: 'settings' },
    ];
}

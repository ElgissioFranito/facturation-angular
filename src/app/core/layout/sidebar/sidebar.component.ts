import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { AuthService } from '../../services/auth/auth.service';
import { LayoutService } from '../../services/ui/layout.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, LucideAngularModule, CommonModule],
  standalone: true,
  template: `
    <!-- Mobile Backdrop -->
    @if (layoutService.isSidebarOpen()) {
      <div class="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 md:hidden" (click)="layoutService.closeSidebar()"></div>
    }

    <div class="h-screen w-64 bg-card border-r border-border flex flex-col fixed left-0 top-0 z-40 transition-transform duration-300"
         [ngClass]="layoutService.isSidebarOpen() ? 'translate-x-0' : '-translate-x-full md:translate-x-0'">
      <div class="p-6 border-b border-border flex items-center justify-between">
        <h1 class="text-2xl font-bold text-primary flex items-center gap-2">
          <lucide-icon name="file-text" class="h-8 w-8 text-secondary"></lucide-icon>
          FreelanceIn
        </h1>
        <button class="md:hidden" (click)="layoutService.closeSidebar()">
            <lucide-icon name="x" class="h-5 w-5"></lucide-icon>
        </button>
      </div>

      <nav class="flex-1 p-4 space-y-1 overflow-y-auto">
        @for (item of menuItems; track item.label) {
          <a [routerLink]="item.path" 
             (click)="layoutService.closeSidebar()"
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
  layoutService = inject(LayoutService);

  menuItems = [
    { label: 'Tableau de bord', path: '/dashboard', icon: 'layout-dashboard' },
    { label: 'Clients', path: '/clients', icon: 'users' },
    { label: 'Factures', path: '/invoices', icon: 'file-text' },
    { label: 'Produits', path: '/products', icon: 'package' },
    { label: 'Reçus', path: '/receipts', icon: 'receipt' },
    { label: 'Paramètres', path: '/settings', icon: 'settings' },
  ];
}


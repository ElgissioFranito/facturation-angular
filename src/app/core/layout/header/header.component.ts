import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { LucideAngularModule } from 'lucide-angular';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-header',
    imports: [LucideAngularModule, DatePipe],
    standalone: true,
    template: `
    <header class="h-16 bg-card border-b border-border flex items-center justify-between px-6 sticky top-0 z-10 backdrop-blur">
      <div class="text-sm text-muted-foreground">
        {{ today | date:'fullDate' }}
      </div>

      <div class="flex items-center gap-4">
        <div class="flex items-center gap-2">
          <div class="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
            {{ userInitial() }}
          </div>
          <span class="text-sm font-medium">{{ authService.currentUser()?.name }}</span>
        </div>
      </div>
    </header>
  `
})
export class HeaderComponent {
    authService = inject(AuthService);
    today = new Date();

    userInitial() {
        return this.authService.currentUser()?.name?.charAt(0).toUpperCase() || 'U';
    }
}

import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { LucideAngularModule, LayoutDashboard, Users, FileText, Package, Receipt, Settings, LogOut } from 'lucide-angular';

import { routes } from './app.routes';
import { authInterceptor } from './core/services/auth/auth.interceptor';
import { apiInterceptor } from './core/services/api/api.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    // provideZoneChangeDetection({ eventCoalescing: true }),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor, apiInterceptor])),
    importProvidersFrom(LucideAngularModule.pick({ LayoutDashboard, Users, FileText, Package, Receipt, Settings, LogOut }))
  ]
};

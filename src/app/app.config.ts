import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom, provideZonelessChangeDetection, LOCALE_ID } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { LucideAngularModule, LayoutDashboard, Users, FileText, Package, Receipt, Settings, LogOut, Euro, CircleCheck, Clock, CircleAlert, Plus, Eye, X, Menu, Copy, Download, Printer, Sun, Moon, Trash2, Image, Stamp, PenTool, ArrowLeft, Edit, Loader2 } from 'lucide-angular';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';

import { routes } from './app.routes';
import { authInterceptor } from './core/services/auth/auth.interceptor';
import { apiInterceptor } from './core/services/api/api.interceptor';

registerLocaleData(localeFr);

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor, apiInterceptor])),
    importProvidersFrom(LucideAngularModule.pick({ LayoutDashboard, Users, FileText, Package, Receipt, Settings, LogOut, Euro, CircleCheck, Clock, CircleAlert, Plus, Eye, X, Menu, Copy, Download, Printer, Sun, Moon, Trash2, Image, Stamp, PenTool, ArrowLeft, Edit, Loader2})),
    { provide: LOCALE_ID, useValue: 'fr-FR' }
  ]
};

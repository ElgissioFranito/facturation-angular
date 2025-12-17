import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, SidebarComponent, HeaderComponent],
  standalone: true,
  template: `
    <div class="min-h-screen bg-background text-foreground flex">
      <app-sidebar></app-sidebar>
      
      <div class="flex-1 flex flex-col md:ml-64 transition-all duration-300">
        <app-header></app-header>
        
        <main class="flex-1 p-6 overflow-y-auto">
          <div class="max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
            <router-outlet></router-outlet>
          </div>
        </main>
      </div>
    </div>
  `
})
export class MainLayoutComponent { }

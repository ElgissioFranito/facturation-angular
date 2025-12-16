import { Component, OnInit, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { KeyMetricsComponent } from './components/key-metrics/key-metrics.component';
import { RevenueChartComponent } from './components/revenue-chart/revenue-chart.component';
import { RecentActivityComponent } from './components/recent-activity/recent-activity.component';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [KeyMetricsComponent, RevenueChartComponent, RecentActivityComponent],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between space-y-2">
        <h2 class="text-3xl font-bold tracking-tight">Tableau de bord</h2>
      </div>

      <app-key-metrics [metrics]="stats()"></app-key-metrics>

      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <app-revenue-chart class="col-span-4"></app-revenue-chart>
        
        <div class="col-span-3 rounded-xl border border-border bg-card text-card-foreground shadow p-6">
           <h3 class="font-semibold leading-none tracking-tight mb-4">Activités Récentes</h3>
           <app-recent-activity></app-recent-activity>
        </div>
      </div>
    </div>
  `
})
export class DashboardPageComponent implements OnInit {
  http = inject(HttpClient);
  stats = signal({
    totalMonth: 0,
    totalYear: 0,
    paidRange: 0,
    pendingRange: 0,
    overdueRange: 0
  });

  ngOnInit() {
    // This call is intercepted by api.interceptor.ts
    this.http.get<any>('/api/dashboard/stats').subscribe(data => {
      this.stats.set(data);
    });
  }
}

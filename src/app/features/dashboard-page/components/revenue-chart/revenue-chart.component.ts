import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { CardComponent, CardHeaderComponent, CardTitleComponent, CardContentComponent } from '../../../../shared/components/ui/card/card.component';

Chart.register(...registerables);

@Component({
    selector: 'app-revenue-chart',
    standalone: true,
    imports: [CardComponent, CardHeaderComponent, CardTitleComponent, CardContentComponent],
    template: `
    <app-card class="col-span-4">
      <app-card-header>
        <app-card-title>Aperçu des Revenus</app-card-title>
      </app-card-header>
      <app-card-content class="pl-2">
        <div class="h-[350px] w-full">
          <canvas #chartCanvas></canvas>
        </div>
      </app-card-content>
    </app-card>
  `
})
export class RevenueChartComponent implements AfterViewInit {
    @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;
    chart: any;

    ngAfterViewInit() {
        this.createChart();
    }

    createChart() {
        const ctx = this.chartCanvas.nativeElement.getContext('2d');
        if (!ctx) return;

        this.chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [{
                    label: 'Revenu (€)',
                    data: [1200, 1900, 3000, 500, 2000, 3200, 4500, 3800, 4200, 3900, 4800, 5100],
                    backgroundColor: 'hsl(221.2 83.2% 53.3%)', // Primary color
                    borderRadius: 4,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false,
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false,
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'hsl(214.3 31.8% 91.4%)', // Border color
                        }
                    }
                }
            }
        });
    }
}

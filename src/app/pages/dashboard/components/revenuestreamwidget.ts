import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { debounceTime, Subscription } from 'rxjs';
import { LayoutService } from '../../../layout/service/layout.service';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { CommonModule } from '@angular/common';

@Component({
    standalone: true,
    selector: 'app-revenue-stream-widget',
    imports: [CommonModule, ChartModule, TranslocoModule],
    template: `<div class="card mb-8!">
        <div class="font-semibold text-xl mb-4">
            {{ 'dashboard.revenueStream.title' | transloco }}
        </div>
        <p-chart type="bar" [data]="chartData" [options]="chartOptions" class="h-100" />
    </div>`
})
export class RevenueStreamWidget implements OnInit, OnDestroy {
    private layoutService = inject(LayoutService);
    private translocoService = inject(TranslocoService);

    chartData: any;
    chartOptions: any;
    layoutSubscription!: Subscription;
    langSubscription!: Subscription;

    // Cache para las traducciones
    private currentLabels: any = null;
    private currentDatasetLabels: any = null;

    constructor() {
        // Suscribirse a cambios de configuración de layout
        this.layoutSubscription = this.layoutService.configUpdate$
            .pipe(debounceTime(25))
            .subscribe(() => {
                this.updateChart();
            });

        // Suscribirse a cambios de idioma
        this.langSubscription = this.translocoService.langChanges$.subscribe(() => {
            this.loadTranslations();
            this.updateChart();
        });
    }

    ngOnInit() {
        this.loadTranslations();
        this.initChart();
    }

    loadTranslations() {
        // Cargar traducciones actuales
        this.currentLabels = this.translocoService.translateObject('dashboard.revenueStream.chart.labels');
        this.currentDatasetLabels = this.translocoService.translateObject('dashboard.revenueStream.chart.datasets');
    }

    initChart() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const borderColor = documentStyle.getPropertyValue('--surface-border');
        const textMutedColor = documentStyle.getPropertyValue('--text-color-secondary');

        this.updateChartData();
        this.updateChartOptions(textColor, borderColor, textMutedColor);
    }

    updateChart() {
        this.updateChartData();
        // Forzar actualización del gráfico
        this.chartData = {...this.chartData};
    }

    updateChartData() {
        this.chartData = {
            labels: this.currentLabels?.quarters || ['Q1', 'Q2', 'Q3', 'Q4'],
            datasets: [
                {
                    type: 'bar',
                    label: this.currentDatasetLabels?.subscriptions || 'Subscriptions',
                    backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--p-primary-400'),
                    data: [4000, 10000, 15000, 4000],
                    barThickness: 32
                },
                {
                    type: 'bar',
                    label: this.currentDatasetLabels?.advertising || 'Advertising',
                    backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--p-primary-300'),
                    data: [2100, 8400, 2400, 7500],
                    barThickness: 32
                },
                {
                    type: 'bar',
                    label: this.currentDatasetLabels?.affiliate || 'Affiliate',
                    backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--p-primary-200'),
                    data: [4100, 5200, 3400, 7400],
                    borderRadius: {
                        topLeft: 8,
                        topRight: 8,
                        bottomLeft: 0,
                        bottomRight: 0
                    },
                    borderSkipped: false,
                    barThickness: 32
                }
            ]
        };
    }

    updateChartOptions(textColor: string, borderColor: string, textMutedColor: string) {
        this.chartOptions = {
            maintainAspectRatio: false,
            aspectRatio: 0.8,
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                x: {
                    stacked: true,
                    ticks: {
                        color: textMutedColor
                    },
                    grid: {
                        color: 'transparent',
                        borderColor: 'transparent'
                    }
                },
                y: {
                    stacked: true,
                    ticks: {
                        color: textMutedColor
                    },
                    grid: {
                        color: borderColor,
                        borderColor: 'transparent',
                        drawTicks: false
                    }
                }
            }
        };
    }

    ngOnDestroy() {
        if (this.layoutSubscription) {
            this.layoutSubscription.unsubscribe();
        }
        if (this.langSubscription) {
            this.langSubscription.unsubscribe();
        }
    }
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';

@Component({
    standalone: true,
    selector: 'app-stats-widget',
    imports: [CommonModule, TranslocoModule],
    template: `
        <div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0 group hover-card transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4 transition-colors duration-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                            {{ 'dashboard.stats.orders.title' | transloco }}
                        </span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl transition-all duration-300 group-hover:text-blue-700 dark:group-hover:text-blue-300 group-hover:scale-105 origin-left">152</div>
                    </div>
                    <div class="flex items-center justify-center bg-blue-100 dark:bg-blue-400/10 rounded-border transition-all duration-300 group-hover:bg-blue-200 dark:group-hover:bg-blue-300/20 group-hover:scale-110 group-hover:rotate-6" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-shopping-cart text-blue-500 text-xl! transition-colors duration-300 group-hover:text-blue-600"></i>
                    </div>
                </div>
                <div class="transition-all duration-300 group-hover:translate-x-1">
                    <span class="text-primary font-medium transition-colors duration-300 group-hover:text-blue-600">24 {{ 'dashboard.stats.orders.new' | transloco }} </span>
                    <span class="text-muted-color transition-colors duration-300 group-hover:text-surface-700 dark:group-hover:text-surface-300">{{ 'dashboard.stats.orders.period' | transloco }}</span>
                </div>
            </div>
        </div>

        <div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0 group hover-card transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4 transition-colors duration-300 group-hover:text-orange-600 dark:group-hover:text-orange-400">
                            {{ 'dashboard.stats.revenue.title' | transloco }}
                        </span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl transition-all duration-300 group-hover:text-orange-700 dark:group-hover:text-orange-300 group-hover:scale-105 origin-left">$2.100</div>
                    </div>
                    <div class="flex items-center justify-center bg-orange-100 dark:bg-orange-400/10 rounded-border transition-all duration-300 group-hover:bg-orange-200 dark:group-hover:bg-orange-300/20 group-hover:scale-110 group-hover:rotate-6" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-dollar text-orange-500 text-xl! transition-colors duration-300 group-hover:text-orange-600"></i>
                    </div>
                </div>
                <div class="transition-all duration-300 group-hover:translate-x-1">
                    <span class="text-primary font-medium transition-colors duration-300 group-hover:text-orange-600">%52+ </span>
                    <span class="text-muted-color transition-colors duration-300 group-hover:text-surface-700 dark:group-hover:text-surface-300">{{ 'dashboard.stats.revenue.period' | transloco }}</span>
                </div>
            </div>
        </div>

        <div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0 group hover-card transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4 transition-colors duration-300 group-hover:text-cyan-600 dark:group-hover:text-cyan-400">
                            {{ 'dashboard.stats.customers.title' | transloco }}
                        </span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl transition-all duration-300 group-hover:text-cyan-700 dark:group-hover:text-cyan-300 group-hover:scale-105 origin-left">28,441</div>
                    </div>
                    <div class="flex items-center justify-center bg-cyan-100 dark:bg-cyan-400/10 rounded-border transition-all duration-300 group-hover:bg-cyan-200 dark:group-hover:bg-cyan-300/20 group-hover:scale-110 group-hover:rotate-6" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-users text-cyan-500 text-xl! transition-colors duration-300 group-hover:text-cyan-600"></i>
                    </div>
                </div>
                <div class="transition-all duration-300 group-hover:translate-x-1">
                    <span class="text-primary font-medium transition-colors duration-300 group-hover:text-cyan-600">520 </span>
                    <span class="text-muted-color transition-colors duration-300 group-hover:text-surface-700 dark:group-hover:text-surface-300">{{ 'dashboard.stats.customers.period' | transloco }}</span>
                </div>
            </div>
        </div>

        <div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0 group hover-card transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4 transition-colors duration-300 group-hover:text-purple-600 dark:group-hover:text-purple-400">
                            {{ 'dashboard.stats.comments.title' | transloco }}
                        </span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl transition-all duration-300 group-hover:text-purple-700 dark:group-hover:text-purple-300 group-hover:scale-105 origin-left">152 {{ 'dashboard.stats.comments.unread' | transloco }}</div>
                    </div>
                    <div class="flex items-center justify-center bg-purple-100 dark:bg-purple-400/10 rounded-border transition-all duration-300 group-hover:bg-purple-200 dark:group-hover:bg-purple-300/20 group-hover:scale-110 group-hover:rotate-6" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-comment text-purple-500 text-xl! transition-colors duration-300 group-hover:text-purple-600"></i>
                    </div>
                </div>
                <div class="transition-all duration-300 group-hover:translate-x-1">
                    <span class="text-primary font-medium transition-colors duration-300 group-hover:text-purple-600">85 </span>
                    <span class="text-muted-color transition-colors duration-300 group-hover:text-surface-700 dark:group-hover:text-surface-300">{{ 'dashboard.stats.comments.period' | transloco }}</span>
                </div>
            </div>
        </div>
    `,
    styles: [`
        .hover-card {
            position: relative;
            overflow: hidden;
            cursor: pointer;
        }

        .hover-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 2px;
            background: linear-gradient(90deg, transparent, var(--primary-color), transparent);
            transition: left 0.5s ease;
        }

        .hover-card:hover::before {
            left: 100%;
        }

        .hover-card::after {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(135deg, rgba(var(--primary-rgb), 0.05), transparent);
            opacity: 0;
            transition: opacity 0.3s ease;
            pointer-events: none;
        }

        .hover-card:hover::after {
            opacity: 1;
        }
    `]
})
export class StatsWidget {}

import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { AppFloatingConfigurator } from '../../layout/component/app.floatingconfigurator';
import { AuthService } from '../service/auth.service';
import { AuthToken } from '@/core/services/jwt.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [
        ButtonModule,
        CheckboxModule,
        InputTextModule,
        PasswordModule,
        FormsModule,
        RouterModule,
        RippleModule,
        ToastModule,
        AppFloatingConfigurator
    ],
    providers: [MessageService],
    template: `
        <p-toast />
        <app-floating-configurator />

        <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-screen overflow-hidden">
            <div class="flex flex-col items-center justify-center">
                <div
                    class="flex flex-col items-center justify-center"
                    style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)"
                >
                    <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">
                        <div class="text-center mb-8">
                            <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">
                                Welcome to Imago Creations!
                            </div>
                            <span class="text-muted-color font-medium">Sign in to continue</span>
                        </div>

                        <form (ngSubmit)="onSubmit()">
                            <div>
                                <label
                                    for="email1"
                                    class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2"
                                >
                                    Email
                                </label>
                                <input
                                    pInputText
                                    id="email1"
                                    type="text"
                                    placeholder="Email address"
                                    class="w-full md:w-120 mb-8"
                                    [(ngModel)]="email"
                                    name="email"
                                    required
                                />

                                <label
                                    for="password1"
                                    class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2"
                                >
                                    Password
                                </label>
                                <p-password
                                    id="password1"
                                    [(ngModel)]="password"
                                    placeholder="Password"
                                    [toggleMask]="true"
                                    styleClass="mb-4"
                                    [fluid]="true"
                                    [feedback]="false"
                                    name="password"
                                    required
                                ></p-password>

                                <div class="flex items-center justify-between mt-2 mb-8 gap-8">
                                    <div class="flex items-center">
                                        <p-checkbox
                                            [(ngModel)]="checked"
                                            id="rememberme1"
                                            binary
                                            class="mr-2"
                                            name="rememberme"
                                        ></p-checkbox>
                                        <label for="rememberme1">Remember me</label>
                                    </div>
                                    <span class="font-medium no-underline ml-2 text-right cursor-pointer text-primary">
                                        Forgot password?
                                    </span>
                                </div>

                                <div class="flex justify-between gap-3">
                                    <button
                                        pButton
                                        type="button"
                                        label="Cancel"
                                        styleClass="p-button-outlined"
                                        (click)="onCancel()"
                                    ></button>
                                    <button
                                        pButton
                                        type="submit"
                                        label="Sign In"
                                        [loading]="loading"
                                    ></button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class Login {
    private authService = inject(AuthService);
    private messageService = inject(MessageService);
    private router = inject(Router);

    email: string = '';
    password: string = '';
    checked: boolean = false;
    loading: boolean = false;

    onSubmit(): void {
        if (!this.email || !this.password) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Validation Error',
                detail: 'Please enter both email and password',
                life: 5000
            });
            return;
        }

        this.loading = true;

        this.authService.login(this.email, this.password).subscribe({
            next: (response: AuthToken) => {
                this.loading = false;
                this.authService.jwt.setToken(response);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Login Successful',
                    detail: 'Welcome back!',
                    life: 3000
                });
                this.router.navigate(['/']);
            },
            error: (error) => {
                this.loading = false;
                this.messageService.add({
                    severity: 'error',
                    summary: 'Login Failed',
                    detail: error.error?.message || 'Invalid email or password',
                    life: 5000
                });
            }
        });
    }

    onCancel(): void {
        this.router.navigate(['/']);
    }
}

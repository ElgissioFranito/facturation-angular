import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { AuthService } from '../../../core/services/auth/auth.service';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { InputComponent } from '../../../shared/components/ui/input/input.component';
import { LabelComponent } from '../../../shared/components/ui/label/label.component';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [
        CommonModule, ReactiveFormsModule, RouterLink, LucideAngularModule,
        ButtonComponent, InputComponent, LabelComponent
    ],
    template: `
    <div class="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div class="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
        <div class="absolute inset-0 bg-primary"></div>
        <div class="relative z-20 flex items-center text-lg font-medium">
          <lucide-icon name="receipt" class="mr-2 h-6 w-6"></lucide-icon>
          Freelance Facturation
        </div>
        <div class="relative z-20 mt-auto">
          <blockquote class="space-y-2">
            <p class="text-lg">
              &ldquo;Cette application a révolutionné ma gestion quotidienne. Je gagne un temps précieux sur ma facturation.&rdquo;
            </p>
            <footer class="text-sm">Sofia Davis</footer>
          </blockquote>
        </div>
      </div>
      <div class="p-8">
        <div class="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div class="flex flex-col space-y-2 text-center">
            <h1 class="text-2xl font-semibold tracking-tight">Connexion</h1>
            <p class="text-sm text-muted-foreground">
              Entrez votre email pour accéder à votre compte
            </p>
          </div>

          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-4">
            <div class="space-y-2">
              <label app-label htmlFor="email">Email</label>
              <input app-input id="email" type="email" placeholder="nom@exemple.com" formControlName="email" />
              @if (loginForm.get('email')?.touched && loginForm.get('email')?.errors?.['required']) {
                <span class="text-xs text-destructive">L'email est requis</span>
              }
              @if (loginForm.get('email')?.touched && loginForm.get('email')?.errors?.['email']) {
                <span class="text-xs text-destructive">Format d'email invalide</span>
              }
            </div>

            <div class="space-y-2">
              <div class="flex items-center justify-between">
                 <label app-label htmlFor="password">Mot de passe</label>
                 <a routerLink="/auth/forgot-password" class="text-sm font-medium text-primary hover:underline">
                   Mot de passe oublié ?
                 </a>
              </div>
              <input app-input id="password" type="password" formControlName="password" />
               @if (loginForm.get('password')?.touched && loginForm.get('password')?.errors?.['required']) {
                <span class="text-xs text-destructive">Le mot de passe est requis</span>
              }
            </div>

            <button app-button type="submit" class="w-full" [disabled]="loginForm.invalid || isLoading()">
              @if (isLoading()) {
                <lucide-icon name="loader-2" class="mr-2 h-4 w-4 animate-spin"></lucide-icon>
              }
              Se connecter
            </button>
          </form>

          <div class="text-center text-sm text-muted-foreground">
             Pas encore de compte ? 
             <a routerLink="/auth/register" class="underline underline-offset-4 hover:text-primary">
               S'inscrire
             </a>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
    private fb = inject(FormBuilder);
    private authService = inject(AuthService);
    isLoading = signal(false);

    loginForm = this.fb.group({
        email: ['demo@freelance.com', [Validators.required, Validators.email]],
        password: ['demo123', [Validators.required]]
    });

    onSubmit() {
        if (this.loginForm.valid) {
            this.isLoading.set(true);
            const { email, password } = this.loginForm.value;

            this.authService.login(email!, password!).subscribe({
                next: () => {
                    // Navigation handled in service
                },
                error: (err) => {
                    console.error(err);
                    this.isLoading.set(false);
                    // Show error message (could integrate toast later)
                }
            });
        }
    }
}

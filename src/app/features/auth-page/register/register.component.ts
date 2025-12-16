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
    selector: 'app-register',
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
              &ldquo;Je peux enfin me concentrer sur mon travail plutôt que sur l'administratif. Un outil indispensable.&rdquo;
            </p>
            <footer class="text-sm">Alex Chen</footer>
          </blockquote>
        </div>
      </div>
      <div class="p-8">
        <div class="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div class="flex flex-col space-y-2 text-center">
            <h1 class="text-2xl font-semibold tracking-tight">Créer un compte</h1>
            <p class="text-sm text-muted-foreground">
              Entrez vos informations pour commencer
            </p>
          </div>

          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="space-y-4">
            <div class="space-y-2">
              <label app-label htmlFor="name">Nom complet</label>
              <input app-input id="name" placeholder="John Doe" formControlName="name" />
              @if (registerForm.get('name')?.touched && registerForm.get('name')?.errors?.['required']) {
                <span class="text-xs text-destructive">Le nom est requis</span>
              }
            </div>

            <div class="space-y-2">
              <label app-label htmlFor="email">Email</label>
              <input app-input id="email" type="email" placeholder="nom@exemple.com" formControlName="email" />
              @if (registerForm.get('email')?.touched && registerForm.get('email')?.errors?.['required']) {
                <span class="text-xs text-destructive">L'email est requis</span>
              }
              @if (registerForm.get('email')?.touched && registerForm.get('email')?.errors?.['email']) {
                <span class="text-xs text-destructive">Format d'email invalide</span>
              }
            </div>

            <div class="space-y-2">
              <label app-label htmlFor="password">Mot de passe</label>
              <input app-input id="password" type="password" formControlName="password" />
               @if (registerForm.get('password')?.touched && registerForm.get('password')?.errors?.['required']) {
                <span class="text-xs text-destructive">Le mot de passe est requis</span>
              }
              @if (registerForm.get('password')?.touched && registerForm.get('password')?.errors?.['minlength']) {
                <span class="text-xs text-destructive">Le mot de passe doit faire au moins 6 caractères</span>
              }
            </div>

             <div class="space-y-2">
              <label app-label htmlFor="confirmPassword">Confirmer le mot de passe</label>
              <input app-input id="confirmPassword" type="password" formControlName="confirmPassword" />
               @if (registerForm.touched && registerForm.errors?.['passwordMismatch']) {
                <span class="text-xs text-destructive">Les mots de passe ne correspondent pas</span>
              }
            </div>

            <button app-button type="submit" class="w-full" [disabled]="registerForm.invalid || isLoading()">
              @if (isLoading()) {
                <lucide-icon name="loader-2" class="mr-2 h-4 w-4 animate-spin"></lucide-icon>
              }
              S'inscrire
            </button>
          </form>

          <div class="text-center text-sm text-muted-foreground">
             Déjà un compte ? 
             <a routerLink="/auth/login" class="underline underline-offset-4 hover:text-primary">
               Se connecter
             </a>
          </div>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent {
    private fb = inject(FormBuilder);
    private authService = inject(AuthService); // Assuming I might add register later or mock it
    private router = inject(Router);
    isLoading = signal(false);

    registerForm = this.fb.group({
        name: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });

    passwordMatchValidator(g: any) {
        return g.get('password').value === g.get('confirmPassword').value
            ? null : { 'passwordMismatch': true };
    }

    onSubmit() {
        if (this.registerForm.valid) {
            this.isLoading.set(true);
            // Mock registration for now
            setTimeout(() => {
                this.isLoading.set(false);
                this.router.navigate(['/auth/login']);
            }, 1000);
        }
    }
}

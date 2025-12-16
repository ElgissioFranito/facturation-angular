import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { InputComponent } from '../../../shared/components/ui/input/input.component';
import { LabelComponent } from '../../../shared/components/ui/label/label.component';

@Component({
    selector: 'app-forgot-password',
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
              &ldquo;La sécurité de vos données est notre priorité.&rdquo;
            </p>
          </blockquote>
        </div>
      </div>
      <div class="p-8">
        <div class="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div class="flex flex-col space-y-2 text-center">
            <h1 class="text-2xl font-semibold tracking-tight">Mot de passe oublié ?</h1>
            <p class="text-sm text-muted-foreground">
              Entrez votre email pour recevoir un lien de réinitialisation
            </p>
          </div>

          @if (isSent()) {
            <div class="rounded-lg bg-green-50 p-4 text-green-800 dark:bg-green-900/30 dark:text-green-300">
              <div class="flex items-center">
                <lucide-icon name="check-circle" class="mr-2 h-4 w-4"></lucide-icon>
                <p class="text-sm font-medium">Email envoyé ! Vérifiez votre boîte de réception.</p>
              </div>
            </div>
             <div class="text-center text-sm text-muted-foreground mt-4">
               <a routerLink="/auth/login" class="underline underline-offset-4 hover:text-primary">
                 Retour à la connexion
               </a>
            </div>
          } @else {
            <form [formGroup]="forgotForm" (ngSubmit)="onSubmit()" class="space-y-4">
              <div class="space-y-2">
                <label app-label htmlFor="email">Email</label>
                <input app-input id="email" type="email" placeholder="nom@exemple.com" formControlName="email" />
                @if (forgotForm.get('email')?.touched && forgotForm.get('email')?.errors?.['required']) {
                  <span class="text-xs text-destructive">L'email est requis</span>
                }
                @if (forgotForm.get('email')?.touched && forgotForm.get('email')?.errors?.['email']) {
                  <span class="text-xs text-destructive">Format d'email invalide</span>
                }
              </div>

              <button app-button type="submit" class="w-full" [disabled]="forgotForm.invalid || isLoading()">
                @if (isLoading()) {
                  <lucide-icon name="loader-2" class="mr-2 h-4 w-4 animate-spin"></lucide-icon>
                }
                Envoyer le lien
              </button>
            </form>

            <div class="text-center text-sm text-muted-foreground">
               <a routerLink="/auth/login" class="underline underline-offset-4 hover:text-primary">
                 Retour à la connexion
               </a>
            </div>
          }
        </div>
      </div>
    </div>
  `
})
export class ForgotPasswordComponent {
    private fb = inject(FormBuilder);
    isLoading = signal(false);
    isSent = signal(false);

    forgotForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]]
    });

    onSubmit() {
        if (this.forgotForm.valid) {
            this.isLoading.set(true);
            // Mock API call
            setTimeout(() => {
                this.isLoading.set(false);
                this.isSent.set(true);
            }, 1500);
        }
    }
}

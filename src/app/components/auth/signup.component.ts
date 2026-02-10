import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { EmailService } from '../../services/email.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="signup-container">
      <div class="signup-card">
        <div class="logo">🎯 Trell-A</div>
        <h1>S'inscrire</h1>

        @if (errorMessage()) {
          <div class="error-message">{{ errorMessage() }}</div>
        }

        @if (successMessage()) {
          <div class="success-message">{{ successMessage() }}</div>
        }

        <form (ngSubmit)="onSubmit()" class="signup-form">
          <div class="form-group">
            <label for="name">Nom complet</label>
            <input
              id="name"
              type="text"
              [(ngModel)]="name"
              name="name"
              placeholder="Ton nom"
              required
            />
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input
              id="email"
              type="email"
              [(ngModel)]="email"
              name="email"
              placeholder="ton@email.com"
              required
            />
          </div>

          <div class="form-group">
            <label for="password">Mot de passe</label>
            <input
              id="password"
              type="password"
              [(ngModel)]="password"
              name="password"
              placeholder="Au moins 6 caractères"
              required
            />
          </div>

          <div class="form-group">
            <label for="confirmPassword">Confirmer le mot de passe</label>
            <input
              id="confirmPassword"
              type="password"
              [(ngModel)]="confirmPassword"
              name="confirmPassword"
              placeholder="Retape ton mot de passe"
              required
            />
          </div>

          <button type="submit" class="btn btn-primary" [disabled]="isLoading()">
            {{ isLoading() ? 'Inscription en cours...' : 'S\'inscrire' }}
          </button>
        </form>

        <p class="login-link">
          Tu as déjà un compte?
          <a routerLink="/login">Se connecter</a>
        </p>
      </div>
    </div>
  `,
  styleUrl: './signup.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignupComponent {
  name = '';
  email = '';
  password = '';
  confirmPassword = '';
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  isLoading = signal(false);

  constructor(
    private authService: AuthService,
    private emailService: EmailService,
    private router: Router
  ) {}

  onSubmit(): void {
    this.errorMessage.set(null);
    this.successMessage.set(null);

    if (!this.name || !this.email || !this.password || !this.confirmPassword) {
      this.errorMessage.set('Veuillez remplir tous les champs');
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage.set('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage.set('Les mots de passe ne correspondent pas');
      return;
    }

    if (!this.isValidEmail(this.email)) {
      this.errorMessage.set('Veuillez entrer une adresse email valide');
      return;
    }

    this.isLoading.set(true);

    // Créer le compte
    const signup = this.authService.signup({
      email: this.email,
      password: this.password,
      name: this.name
    });

    if (signup) {
      // Envoyer un email de bienvenue
      this.emailService.sendWelcomeEmail(this.email, this.name).then(() => {
        this.successMessage.set('Compte créé avec succès! Bienvenue à Trell-A 🎉');

        // Rediriger après 2 secondes
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 2000);
      });
    } else {
      this.errorMessage.set('Cet email est déjà utilisé');
      this.isLoading.set(false);
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

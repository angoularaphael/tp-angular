import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="login-container">
      <div class="login-card">
        <div class="logo">🎯 Trell-A</div>
        <h1>Connexion</h1>

        @if (errorMessage()) {
          <div class="error-message">{{ errorMessage() }}</div>
        }

        <form (ngSubmit)="onSubmit()" class="login-form">
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
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" class="btn btn-primary" [disabled]="isLoading()">
            {{ isLoading() ? 'Connexion en cours...' : 'Se connecter' }}
          </button>
        </form>

        <p class="signup-link">
          Pas encore de compte?
          <a routerLink="/signup">S'inscrire</a>
        </p>
      </div>
    </div>
  `,
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = signal<string | null>(null);
  isLoading = signal(false);

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (!this.email || !this.password) {
      this.errorMessage.set('Veuillez remplir tous les champs');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    // Simuler un délai réseau
    setTimeout(() => {
      const success = this.authService.login({
        email: this.email,
        password: this.password
      });

      if (success) {
        this.router.navigate(['/dashboard']);
      } else {
        this.errorMessage.set('Email ou mot de passe incorrect');
      }

      this.isLoading.set(false);
    }, 500);
  }
}

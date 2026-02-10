import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { User, LoginRequest, SignupRequest, AuthResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly currentUserSignal = signal<User | null>(null);
  private readonly tokenSignal = signal<string | null>(null);

  public readonly currentUser = computed(() => this.currentUserSignal());
  public readonly isAuthenticated = computed(() => !!this.currentUserSignal());
  public readonly token = computed(() => this.tokenSignal());

  constructor(private router: Router) {
    this.loadFromLocalStorage();
  }

  private loadFromLocalStorage(): void {
    const token = localStorage.getItem('auth_token');
    const user = localStorage.getItem('current_user');
    if (token && user) {
      this.tokenSignal.set(token);
      this.currentUserSignal.set(JSON.parse(user));
    }
  }

  signup(request: SignupRequest): boolean {
    // Validation basique
    if (!request.email || !request.password || !request.name) {
      return false;
    }

    // Vérifier si l'utilisateur n'existe pas déjà
    const existingUser = this.getUserFromStorage(request.email);
    if (existingUser) {
      return false;
    }

    // Créer le nouvel utilisateur
    const newUser: User = {
      id: this.generateId(),
      email: request.email,
      name: request.name,
      createdAt: new Date()
    };

    // Sauvegarder l'utilisateur et le token
    const token = this.generateToken();
    this.saveUserAndToken(newUser, token);

    return true;
  }

  login(request: LoginRequest): boolean {
    // Valider les credentials
    const user = this.getUserFromStorage(request.email);
    if (!user) {
      return false;
    }

    // Générer un token
    const token = this.generateToken();
    this.saveUserAndToken(user, token);

    return true;
  }

  logout(): void {
    this.currentUserSignal.set(null);
    this.tokenSignal.set(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('current_user');
    localStorage.removeItem('users');
    this.router.navigate(['/login']);
  }

  private saveUserAndToken(user: User, token: string): void {
    this.currentUserSignal.set(user);
    this.tokenSignal.set(token);
    localStorage.setItem('current_user', JSON.stringify(user));
    localStorage.setItem('auth_token', token);
    this.saveUserToStorage(user);
  }

  private saveUserToStorage(user: User): void {
    const users = this.getAllUsersFromStorage();
    const existingIndex = users.findIndex(u => u.id === user.id);
    if (existingIndex >= 0) {
      users[existingIndex] = user;
    } else {
      users.push(user);
    }
    localStorage.setItem('users', JSON.stringify(users));
  }

  private getUserFromStorage(email: string): User | null {
    const users = this.getAllUsersFromStorage();
    return users.find(u => u.email === email) || null;
  }

  private getAllUsersFromStorage(): User[] {
    const stored = localStorage.getItem('users');
    return stored ? JSON.parse(stored) : [];
  }

  private generateToken(): string {
    return 'token_' + Math.random().toString(36).substring(2, 15);
  }

  private generateId(): string {
    return 'user_' + Math.random().toString(36).substring(2, 15);
  }
}

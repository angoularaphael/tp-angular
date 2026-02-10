import { Component, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { BoardService } from '../../services/board.service';
import { Board } from '../../models/board.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="dashboard">
      <header class="dashboard-header">
        <div class="header-left">
          <h1>🎯 Trell-A</h1>
          <p>Bienvenue, {{ currentUser()?.name }}!</p>
        </div>
        <button class="btn btn-logout" (click)="logout()">
          Déconnexion
        </button>
      </header>

      <main class="dashboard-main">
        <section class="boards-section">
          <div class="section-header">
            <h2>Mes tableaux</h2>
            <button class="btn btn-primary" (click)="toggleNewBoardForm()">
              + Nouveau tableau
            </button>
          </div>

          @if (showNewBoardForm()) {
            <div class="new-board-form">
              <div class="form-group">
                <label for="boardTitle">Titre du tableau</label>
                <input
                  id="boardTitle"
                  type="text"
                  [(ngModel)]="newBoardTitle"
                  name="boardTitle"
                  placeholder="Mon nouveau tableau..."
                  (keyup.enter)="createBoard()"
                />
              </div>
              <div class="form-group">
                <label for="boardDesc">Description (optionnel)</label>
                <textarea
                  id="boardDesc"
                  [(ngModel)]="newBoardDesc"
                  name="boardDesc"
                  placeholder="Décrivez votre tableau..."
                  rows="3"
                ></textarea>
              </div>
              <div class="form-actions">
                <button type="button" class="btn btn-primary" (click)="createBoard()">
                  Créer le tableau
                </button>
                <button type="button" class="btn btn-secondary" (click)="toggleNewBoardForm()">
                  Annuler
                </button>
              </div>
            </div>
          }

          <div class="boards-grid">
            @if (userBoards().length === 0) {
              <div class="empty-state">
                <p>Aucun tableau pour le moment. Crée ton premier tableau!</p>
              </div>
            } @else {
              @for (board of userBoards(); track board.id) {
                <div class="board-card">
                  <div class="board-header-info">
                    <h3>{{ board.title }}</h3>
                    <button
                      class="btn-icon"
                      [attr.aria-label]="'Supprimer ' + board.title"
                      (click)="deleteBoard(board.id)"
                    >
                      🗑️
                    </button>
                  </div>
                  @if (board.description) {
                    <p class="board-description">{{ board.description }}</p>
                  }
                  <div class="board-stats">
                    <span>📋 {{ board.lists.length }} listes</span>
                    <span>👥 {{ board.collaborators.length }} collaborateurs</span>
                  </div>
                  <div class="board-actions">
                    <a [routerLink]="['/board', board.id]" class="btn btn-primary">
                      Ouvrir
                    </a>
                    <button
                      class="btn btn-secondary"
                      (click)="openInviteDialog(board)"
                    >
                      Ajouter collaborateur
                    </button>
                  </div>
                </div>
              }
            }
          </div>
        </section>
      </main>

      @if (selectedBoardForInvite()) {
        <div class="modal-overlay" (click)="closeInviteDialog()">
          <div class="modal" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h2>Ajouter un collaborateur</h2>
              <button class="btn-close" (click)="closeInviteDialog()">✕</button>
            </div>
            <div class="modal-body">
              <p class="modal-subtitle">
                Inviter quelqu'un à {{ selectedBoardForInvite()?.title }}
              </p>
              <div class="form-group">
                <label for="collaboratorEmail">Email du collaborateur</label>
                <input
                  id="collaboratorEmail"
                  type="email"
                  [(ngModel)]="collaboratorEmail"
                  name="collaboratorEmail"
                  placeholder="collaborateur@email.com"
                  (keyup.enter)="inviteCollaborator()"
                />
              </div>
              <div class="form-actions">
                <button class="btn btn-primary" (click)="inviteCollaborator()">
                  Envoyer l'invitation
                </button>
                <button class="btn btn-secondary" (click)="closeInviteDialog()">
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styleUrl: './dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent {
  currentUser = signal<any>(null);
  userBoards = signal<Board[]>([]);
  showNewBoardForm = signal(false);
  newBoardTitle = '';
  newBoardDesc = '';
  selectedBoardForInvite = signal<Board | null>(null);
  collaboratorEmail = '';

  constructor(
    private authService: AuthService,
    private boardService: BoardService,
    private router: Router
  ) {
    this.loadDashboard();
  }

  private loadDashboard(): void {
    const user = this.authService.currentUser();
    if (user) {
      this.currentUser.set(user);
      this.userBoards.set(this.boardService.getUserBoards(user.id));
    }
  }

  toggleNewBoardForm(): void {
    this.showNewBoardForm.update(v => !v);
    this.newBoardTitle = '';
    this.newBoardDesc = '';
  }

  createBoard(): void {
    if (!this.newBoardTitle.trim()) {
      alert('Veuillez entrer un titre');
      return;
    }

    const user = this.authService.currentUser();
    if (user) {
      this.boardService.createBoard(
        this.newBoardTitle,
        user,
        this.newBoardDesc || undefined
      );
      this.userBoards.set(this.boardService.getUserBoards(user.id));
      this.toggleNewBoardForm();
    }
  }

  deleteBoard(boardId: string): void {
    if (confirm('Êtes-vous sûr? Cette action est irréversible.')) {
      this.boardService.deleteBoard(boardId);
      const user = this.authService.currentUser();
      if (user) {
        this.userBoards.set(this.boardService.getUserBoards(user.id));
      }
    }
  }

  openInviteDialog(board: Board): void {
    this.selectedBoardForInvite.set(board);
    this.collaboratorEmail = '';
  }

  closeInviteDialog(): void {
    this.selectedBoardForInvite.set(null);
    this.collaboratorEmail = '';
  }

  inviteCollaborator(): void {
    const board = this.selectedBoardForInvite();
    if (!board || !this.collaboratorEmail.trim()) {
      alert('Veuillez entrer un email valide');
      return;
    }

    // Créer ou récupérer l'utilisateur
    const invitedUser = this.getOrCreateUser(this.collaboratorEmail);
    if (invitedUser) {
      this.boardService.addCollaborator(board.id, invitedUser);
      alert(`${this.collaboratorEmail} a été ajouté au tableau!`);
      this.closeInviteDialog();
      this.loadDashboard();
    }
  }

  private getOrCreateUser(email: string): any {
    // Récupérer des users en localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    let user = users.find((u: any) => u.email === email);

    if (!user) {
      // Créer un nouvel utilisateur temporaire
      user = {
        id: 'user_' + Math.random().toString(36).substring(2, 15),
        email: email,
        name: email.split('@')[0],
        createdAt: new Date()
      };
      users.push(user);
      localStorage.setItem('users', JSON.stringify(users));
    }

    return user;
  }

  logout(): void {
    this.authService.logout();
  }
}

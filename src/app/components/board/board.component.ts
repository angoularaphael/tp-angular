import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BoardService } from '../../services/board.service';
import { AuthService } from '../../services/auth.service';
import { Board, Card } from '../../models/board.model';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    @if (board()) {
      <div class="board-view">
        <header class="board-header">
          <div class="header-left">
            <button class="btn-back" (click)="goBack()">← Retour</button>
            <h1>{{ board()?.title }}</h1>
          </div>
          <div class="header-right">
            <span class="collaborators-info">
              {{ board()?.collaborators?.length ?? 0 }} Collaborateurs
            </span>
          </div>
        </header>

        <main class="board-content">
          <div class="lists-container">
            @for (list of board()!.lists; track list.id) {
              <div class="list">
                <div class="list-header">
                  <h3>{{ list.title }}</h3>
                  <span class="card-count">{{ list.cards.length }}</span>
                </div>

                <div class="cards-area">
                  @for (card of list.cards; track card.id) {
                    <div class="card" (click)="selectCard(card, list.id)">
                      <h4>{{ card.title }}</h4>
                      @if (card.description) {
                        <p class="card-description">{{ card.description }}</p>
                      }
                      <div class="card-meta">
                        @if (card.status) {
                          <span class="status" [ngClass]="'status-' + card.status">{{ getStatusLabel(card.status) }}</span>
                        }
                        @if (card.dueDate) {
                          <span class="due-date">{{ formatDate(card.dueDate) }}</span>
                        }
                      </div>
                    </div>
                  }
                </div>

                <button class="btn-add-card" (click)="toggleAddCardForm(list.id)">
                  + Ajouter une carte
                </button>

                @if (addingCardToListId() === list.id) {
                  <div class="add-card-form">
                    <input
                      type="text"
                      [(ngModel)]="newCardTitle"
                      placeholder="Titre de la carte..."
                      (keyup.enter)="addCard(list.id)"
                      class="card-title-input"
                    />
                    <div class="form-actions">
                      <button class="btn btn-primary" (click)="addCard(list.id)">
                        Ajouter
                      </button>
                      <button class="btn btn-secondary" (click)="toggleAddCardForm(null)">
                        Annuler
                      </button>
                    </div>
                  </div>
                }
              </div>
            }

            <div class="list">
              <div class="list-header">
                <input
                  type="text"
                  [(ngModel)]="newListTitle"
                  placeholder="Nouvelle liste..."
                  class="new-list-input"
                  (keyup.enter)="addList()"
                />
              </div>
              <button class="btn-add-list" (click)="addList()">
                + Ajouter une liste
              </button>
            </div>
          </div>
        </main>

        @if (selectedCard()) {
          <div class="card-modal-overlay" (click)="closeCardModal()">
            <div class="card-modal" (click)="$event.stopPropagation()">
              <div class="card-modal-header">
                <h2>{{ selectedCard()?.title }}</h2>
                <button class="btn-close" (click)="closeCardModal()">×</button>
              </div>
              <div class="card-modal-body">
                <div class="modal-section">
                  <h3>Description</h3>
                  <textarea
                    [(ngModel)]="selectedCard()!.description"
                    placeholder="Ajouter une description..."
                    (change)="updateSelectedCard()"
                  ></textarea>
                </div>

                <div class="modal-section">
                  <h3>Statut</h3>
                  <select
                    [(ngModel)]="selectedCard()!.status"
                    (change)="updateSelectedCard()"
                    class="status-select"
                  >
                    <option value="" disabled selected>Sélectionner un statut</option>
                    <option value="todo">À faire</option>
                    <option value="in-progress">En cours</option>
                    <option value="done">Terminé</option>
                  </select>
                </div>

                <div class="modal-section">
                  <h3>Date limite</h3>
                  <input
                    type="date"
                    [(ngModel)]="selectedCard()!.dueDate"
                    (change)="updateSelectedCard()"
                  />
                </div>

                <div class="modal-actions">
                  <button
                    class="btn btn-danger"
                    (click)="deleteCard(selectedCard()!.id)"
                  >
                    Supprimer la carte
                  </button>
                  <button class="btn btn-secondary" (click)="closeCardModal()">
                    Fermer
                  </button>
                </div>
              </div>
            </div>
          </div>
        }
      </div>
    } @else {
      <div class="loading">Chargement...</div>
    }
  `,
  styleUrl: './board.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BoardComponent {
  board = signal<Board | undefined>(undefined);
  selectedCard = signal<Card | null>(null);
  selectedCardListId = signal<string | null>(null);
  addingCardToListId = signal<string | null>(null);
  newCardTitle = '';
  newListTitle = '';

  constructor(
    private route: ActivatedRoute,
    private boardService: BoardService,
    private authService: AuthService,
    private router: Router
  ) {
    this.loadBoard();
  }

  private loadBoard(): void {
    const boardId = this.route.snapshot.paramMap.get('id');
    if (boardId) {
      const loadedBoard = this.boardService.getBoard(boardId);
      this.board.set(loadedBoard);
    }
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }

  toggleAddCardForm(listId: string | null): void {
    this.addingCardToListId.set(this.addingCardToListId() === listId ? null : listId);
    this.newCardTitle = '';
  }

  addCard(listId: string): void {
    if (!this.newCardTitle.trim()) {
      alert('Veuillez entrer un titre');
      return;
    }

    const boardId = this.route.snapshot.paramMap.get('id');
    if (boardId) {
      this.boardService.createCard(boardId, listId, this.newCardTitle);
      this.loadBoard();
      this.toggleAddCardForm(null);
    }
  }

  addList(): void {
    if (!this.newListTitle.trim()) {
      alert('Veuillez entrer un titre');
      return;
    }

    const boardId = this.route.snapshot.paramMap.get('id');
    if (boardId) {
      this.boardService.createList(boardId, this.newListTitle);
      this.loadBoard();
      this.newListTitle = '';
    }
  }

  selectCard(card: Card, listId: string): void {
    this.selectedCard.set({ ...card });
    this.selectedCardListId.set(listId);
  }

  closeCardModal(): void {
    this.selectedCard.set(null);
    this.selectedCardListId.set(null);
  }

  updateSelectedCard(): void {
    const card = this.selectedCard();
    const listId = this.selectedCardListId();
    const boardId = this.route.snapshot.paramMap.get('id');

    if (card && listId && boardId) {
      this.boardService.updateCard(boardId, listId, card.id, card);
      this.loadBoard();
    }
  }

  deleteCard(cardId: string): void {
    if (!confirm('Êtes-vous sûr?')) {
      return;
    }

    const boardId = this.route.snapshot.paramMap.get('id');
    const listId = this.selectedCardListId();

    if (boardId && listId) {
      this.boardService.deleteCard(boardId, listId, cardId);
      this.closeCardModal();
      this.loadBoard();
    }
  }

  formatDate(date: Date | string | undefined): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('fr-FR');
  }

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'todo': 'À faire',
      'in-progress': 'En cours',
      'done': 'Terminé'
    };
    return labels[status] || status;
  }
}

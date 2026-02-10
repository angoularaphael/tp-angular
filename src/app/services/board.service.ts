import { Injectable, signal, computed } from '@angular/core';
import { Board, List, Card } from '../models/board.model';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class BoardService {
  private readonly boardsSignal = signal<Board[]>([]);
  public readonly boards = computed(() => this.boardsSignal());

  constructor() {
    this.loadFromLocalStorage();
  }

  private loadFromLocalStorage(): void {
    const stored = localStorage.getItem('boards');
    if (stored) {
      this.boardsSignal.set(JSON.parse(stored));
    }
  }

  private saveToLocalStorage(): void {
    localStorage.setItem('boards', JSON.stringify(this.boardsSignal()));
  }

  createBoard(title: string, owner: User, description?: string): Board {
    const board: Board = {
      id: this.generateId(),
      title,
      description,
      owner,
      collaborators: [owner],
      lists: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.boardsSignal.update(boards => [...boards, board]);
    this.saveToLocalStorage();
    return board;
  }

  getBoard(id: string): Board | undefined {
    return this.boardsSignal().find(b => b.id === id);
  }

  getUserBoards(userId: string): Board[] {
    return this.boardsSignal().filter(b =>
      b.owner.id === userId || b.collaborators.some(c => c.id === userId)
    );
  }

  updateBoard(id: string, updates: Partial<Board>): void {
    this.boardsSignal.update(boards =>
      boards.map(b => b.id === id ? { ...b, ...updates, updatedAt: new Date() } : b)
    );
    this.saveToLocalStorage();
  }

  deleteBoard(id: string): void {
    this.boardsSignal.update(boards => boards.filter(b => b.id !== id));
    this.saveToLocalStorage();
  }

  addCollaborator(boardId: string, collaborator: User): void {
    const board = this.getBoard(boardId);
    if (board && !board.collaborators.find(c => c.id === collaborator.id)) {
      board.collaborators.push(collaborator);
      this.updateBoard(boardId, board);
    }
  }

  createList(boardId: string, title: string): List | null {
    const board = this.getBoard(boardId);
    if (!board) return null;

    const list: List = {
      id: this.generateId(),
      title,
      boardId,
      cards: [],
      position: board.lists.length,
      createdAt: new Date()
    };

    board.lists.push(list);
    this.updateBoard(boardId, board);
    return list;
  }

  createCard(boardId: string, listId: string, title: string, description?: string): Card | null {
    const board = this.getBoard(boardId);
    if (!board) return null;

    const list = board.lists.find(l => l.id === listId);
    if (!list) return null;

    const card: Card = {
      id: this.generateId(),
      title,
      description,
      listId,
      position: list.cards.length,
      assignees: [],
      labels: [],
      comments: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    list.cards.push(card);
    this.updateBoard(boardId, board);
    return card;
  }

  updateCard(boardId: string, listId: string, cardId: string, updates: Partial<Card>): void {
    const board = this.getBoard(boardId);
    if (!board) return;

    const list = board.lists.find(l => l.id === listId);
    if (!list) return;

    const card = list.cards.find(c => c.id === cardId);
    if (card) {
      Object.assign(card, updates, { updatedAt: new Date() });
      this.updateBoard(boardId, board);
    }
  }

  deleteCard(boardId: string, listId: string, cardId: string): void {
    const board = this.getBoard(boardId);
    if (!board) return;

    const list = board.lists.find(l => l.id === listId);
    if (list) {
      list.cards = list.cards.filter(c => c.id !== cardId);
      this.updateBoard(boardId, board);
    }
  }

  moveCard(boardId: string, cardId: string, fromListId: string, toListId: string, position: number): void {
    const board = this.getBoard(boardId);
    if (!board) return;

    const fromList = board.lists.find(l => l.id === fromListId);
    const toList = board.lists.find(l => l.id === toListId);

    if (fromList && toList) {
      const card = fromList.cards.find(c => c.id === cardId);
      if (card) {
        fromList.cards = fromList.cards.filter(c => c.id !== cardId);
        card.listId = toListId;
        card.position = position;
        toList.cards.splice(position, 0, card);
        this.updateBoard(boardId, board);
      }
    }
  }

  private generateId(): string {
    return 'id_' + Math.random().toString(36).substring(2, 15);
  }
}

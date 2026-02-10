import { User } from './user.model';

export interface Board {
  id: string;
  title: string;
  description?: string;
  owner: User;
  collaborators: User[];
  lists: List[];
  backgroundColor?: string;
  backgroundImage?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface List {
  id: string;
  title: string;
  boardId: string;
  cards: Card[];
  position: number;
  createdAt: Date;
}

export interface Card {
  id: string;
  title: string;
  description?: string;
  listId: string;
  position: number;
  assignees?: User[];
  dueDate?: Date;
  status?: 'todo' | 'in-progress' | 'done';
  labels?: Label[];
  attachments?: Attachment[];
  comments?: Comment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Label {
  id: string;
  name: string;
  color: string;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  uploadedAt: Date;
}

export interface Comment {
  id: string;
  author: User;
  text: string;
  createdAt: Date;
}

export interface CollaboratorInvite {
  id: string;
  boardId: string;
  invitedEmail: string;
  invitedBy: User;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
  expiresAt: Date;
}

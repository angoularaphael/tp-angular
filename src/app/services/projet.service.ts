import { Injectable } from '@angular/core';

export interface Projet {
  id: number;
  nom: string;
  statut: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProjetService {
  private projets: Projet[] = [
    { id: 1, nom: 'Projet Angular', statut: 'En cours' },
    { id: 2, nom: 'Site e-commerce', statut: 'Planifié' },
    { id: 3, nom: 'Application mobile', statut: 'Terminé' },
    { id: 4, nom: 'Dashboard analytics', statut: 'En cours' },
  ];

  getAllProjets(): Projet[] {
    return this.projets;
  }

  getProjetById(id: number): Projet | undefined {
    return this.projets.find(p => p.id === id);
  }

  addProjet(projet: Omit<Projet, 'id'>): void {
    const newId = Math.max(...this.projets.map(p => p.id), 0) + 1;
    const newProjet: Projet = { ...projet, id: newId };
    this.projets.push(newProjet);
  }
}

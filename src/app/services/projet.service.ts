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

  getProjetById(id: number) {
    for (let i = 0; i < this.projets.length; i++) {
      if (this.projets[i].id === id) {
        return this.projets[i];
      }
    }
    return null;
  }

  addProjet(nom: string, statut: string): void {
    let newId = 1;
    if (this.projets.length > 0) {
      newId = this.projets[this.projets.length - 1].id + 1;
    }
    
    let newProjet = { id: newId, nom: nom, statut: statut };
    this.projets.push(newProjet);
  }
}

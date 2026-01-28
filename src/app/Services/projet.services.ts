import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ProjetServices {
  projets = [
    { id: 1, nom: 'Projet Angular', statut: 'En cours' },
    { id: 2, nom: 'Site e-commerce', statut: 'Planifié' },
    { id: 3, nom: 'Application mobile', statut: 'Terminé' },
    { id: 4, nom: 'Dashboard analytics', statut: 'En cours' },
  ];
}


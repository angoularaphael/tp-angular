import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProjetService, Projet } from '../../services/projet.service';

@Component({
  selector: 'app-liste-projets-component',
  imports: [RouterLink],
  templateUrl: './liste-projets-component.html',
  styleUrl: './liste-projets-component.scss',
})
export class ListeProjetsComponent {
  private projetService = inject(ProjetService);
  projets: Projet[];

  constructor() {
    this.projets = this.projetService.getAllProjets();
  }
}

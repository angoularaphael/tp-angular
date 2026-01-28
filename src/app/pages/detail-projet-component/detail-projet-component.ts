import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProjetService, Projet } from '../../services/projet.service';

@Component({
  selector: 'app-detail-projet-component',
  imports: [RouterLink],
  templateUrl: './detail-projet-component.html',
  styleUrl: './detail-projet-component.scss',
})
export class DetailProjetComponent {
  private projetService = inject(ProjetService);
  private route = inject(ActivatedRoute);

  projet: Projet | undefined;

  constructor() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.projet = this.projetService.getProjetById(id);
  }
}

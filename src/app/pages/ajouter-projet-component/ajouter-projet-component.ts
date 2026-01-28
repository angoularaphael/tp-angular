import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ProjetService } from '../../services/projet.service';

@Component({
  selector: 'app-ajouter-projet-component',
  imports: [FormsModule, RouterLink],
  templateUrl: './ajouter-projet-component.html',
  styleUrl: './ajouter-projet-component.scss',
})
export class AjouterProjetComponent {
  private projetService = inject(ProjetService);
  private router = inject(Router);

  nom: string = '';
  statut: string = '';

  onSubmit() {
    if (this.nom.trim()) {
      this.projetService.addProjet({
        nom: this.nom,
        statut: this.statut
      });
      this.router.navigate(['/']);
    }
  }
}

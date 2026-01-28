import { Routes } from '@angular/router';
import { ListeProjetsComponent } from './pages/liste-projets-component/liste-projets-component';  
import { DetailProjetComponent } from './pages/detail-projet-component/detail-projet-component';
import { AjouterProjetComponent } from './pages/ajouter-projet-component/ajouter-projet-component';

export const routes: Routes = [
    {path :'', component : ListeProjetsComponent},
    {path : 'projet/:id', component : DetailProjetComponent},
    {path : 'ajouter', component : AjouterProjetComponent}

];


// Étape 3 — Liste des projets
// Objectif : Afficher les projets depuis le service.
// Travail à faire dans ListeProjetsComponent :
//  injecter le ProjetService
//  récupérer la liste des projets depuis le service
//  afficher les projets dans le t
// emplate
//  ajouter un lien « Voir détail » pour chaque projet
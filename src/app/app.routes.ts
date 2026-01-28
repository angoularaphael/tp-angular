import { Routes } from '@angular/router';
import { ListeProjetsComponent } from './pages/liste-projets-component/liste-projets-component';
import { AjouterProjetComponent } from './pages/ajouter-projet-component/ajouter-projet-component';
import { DetailProjetComponent } from './pages/detail-projet-component/detail-projet-component';

export const routes: Routes = [
    { path: '', component: ListeProjetsComponent },
    { path: 'projet/:id', component: DetailProjetComponent },
    { path: 'ajouter', component: AjouterProjetComponent }
];

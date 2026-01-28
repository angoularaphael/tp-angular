import { Component } from '@angular/core';
import { ProjetServices } from '../../Services/projet.services';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-liste-projets-component',
  imports: [RouterLink],
  templateUrl: './liste-projets-component.html',
  styleUrl: './liste-projets-component.scss',
})
export class ListeProjetsComponent {
constructor (public projetServices: ProjetServices){

}
}


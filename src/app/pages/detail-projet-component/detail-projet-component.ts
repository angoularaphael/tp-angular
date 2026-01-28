import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { RouterModule } from '@angular/router';



@Component({
  selector: 'app-detail-projet-component',
  standalone: true,
  imports: [RouterModule, RouterLink],
  templateUrl: './detail-projet-component.html',
  styleUrl: './detail-projet-component.scss',
})
export class DetailProjetComponent {
  constructor(private route: ActivatedRoute) {}

ngOnInit() {
  const id = this.route.snapshot.paramMap.get('id');
  console.log('ID du projet :', id);
  
}

}

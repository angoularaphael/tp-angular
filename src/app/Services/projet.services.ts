import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ProjetServices {
  tasks = [
    { id: 0, name: 'Projet 1', done: false },
    { id: 1, name: 'Projet 2', done: true },
    { id: 2, name: 'Projet 3', done: false }
  ];
}

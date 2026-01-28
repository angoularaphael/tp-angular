import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeProjet } from './liste-projet';

describe('ListeProjet', () => {
  let component: ListeProjet;
  let fixture: ComponentFixture<ListeProjet>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListeProjet]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListeProjet);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

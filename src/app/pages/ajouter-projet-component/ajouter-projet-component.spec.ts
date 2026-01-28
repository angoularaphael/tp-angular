import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjouterProjetComponent } from './ajouter-projet-component';

describe('AjouterProjetComponent', () => {
  let component: AjouterProjetComponent;
  let fixture: ComponentFixture<AjouterProjetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AjouterProjetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AjouterProjetComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailProjetComponent } from './detail-projet-component';

describe('DetailProjetComponent', () => {
  let component: DetailProjetComponent;
  let fixture: ComponentFixture<DetailProjetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailProjetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailProjetComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

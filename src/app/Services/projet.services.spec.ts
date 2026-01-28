import { TestBed } from '@angular/core/testing';

import { ProjetServices } from './projet.services';

describe('ProjetServices', () => {
  let service: ProjetServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjetServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

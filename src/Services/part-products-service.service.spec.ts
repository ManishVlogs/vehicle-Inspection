import { TestBed } from '@angular/core/testing';

import { PartProductsServiceService } from './part-products-service.service';

describe('PartProductsServiceService', () => {
  let service: PartProductsServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PartProductsServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

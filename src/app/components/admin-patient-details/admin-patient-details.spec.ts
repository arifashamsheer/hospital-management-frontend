import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPatientDetails } from './admin-patient-details';

describe('AdminPatientDetails', () => {
  let component: AdminPatientDetails;
  let fixture: ComponentFixture<AdminPatientDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminPatientDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminPatientDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

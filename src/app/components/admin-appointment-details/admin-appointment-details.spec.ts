import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAppointmentDetails } from './admin-appointment-details';

describe('AdminAppointmentDetails', () => {
  let component: AdminAppointmentDetails;
  let fixture: ComponentFixture<AdminAppointmentDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminAppointmentDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminAppointmentDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

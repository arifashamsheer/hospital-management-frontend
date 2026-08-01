import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDoctorDetails } from './admin-doctor-details';

describe('AdminDoctorDetails', () => {
  let component: AdminDoctorDetails;
  let fixture: ComponentFixture<AdminDoctorDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminDoctorDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDoctorDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

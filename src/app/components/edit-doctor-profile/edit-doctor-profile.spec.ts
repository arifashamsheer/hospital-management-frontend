import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDoctorProfile } from './edit-doctor-profile';

describe('EditDoctorProfile', () => {
  let component: EditDoctorProfile;
  let fixture: ComponentFixture<EditDoctorProfile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditDoctorProfile]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditDoctorProfile);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

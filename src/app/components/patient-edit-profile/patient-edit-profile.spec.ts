import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientEditProfile } from './patient-edit-profile';

describe('PatientEditProfile', () => {
  let component: PatientEditProfile;
  let fixture: ComponentFixture<PatientEditProfile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PatientEditProfile]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientEditProfile);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

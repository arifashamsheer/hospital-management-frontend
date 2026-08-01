import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterDoctor } from './register-doctor';

describe('RegisterDoctor', () => {
  let component: RegisterDoctor;
  let fixture: ComponentFixture<RegisterDoctor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisterDoctor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterDoctor);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

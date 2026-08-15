import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import {
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';

import {
  provideRouter
} from '@angular/router';

import {
  provideHttpClient
} from '@angular/common/http';

import {
  provideHttpClientTesting
} from '@angular/common/http/testing';

import {
  MaterialModule
} from '../../material.module';

import {
  RegisterDoctor
} from './register-doctor';

describe('RegisterDoctor', () => {

  let component: RegisterDoctor;
  let fixture: ComponentFixture<RegisterDoctor>;

  beforeEach(async () => {

    await TestBed.configureTestingModule({

      declarations: [
        RegisterDoctor
      ],

      imports: [
        FormsModule,
        ReactiveFormsModule,
        MaterialModule
      ],

      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting()
      ]

    }).compileComponents();

    fixture =
      TestBed.createComponent(RegisterDoctor);

    component =
      fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
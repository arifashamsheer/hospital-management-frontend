import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import {
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
  provideNoopAnimations
} from '@angular/platform-browser/animations';

import {
  MaterialModule
} from '../../material.module';

import {
  Register
} from './register';


describe('Register', () => {

  let component: Register;
  let fixture: ComponentFixture<Register>;

  beforeEach(async () => {

    await TestBed.configureTestingModule({

      declarations: [
        Register
      ],

      imports: [
        ReactiveFormsModule,
        MaterialModule
      ],

      providers: [

        // Modern replacement for RouterTestingModule
        provideRouter([]),

        // Modern HttpClient testing setup
        provideHttpClient(),
        provideHttpClientTesting(),

        // Replacement for NoopAnimationsModule
        provideNoopAnimations()

      ]

    }).compileComponents();


    fixture =
      TestBed.createComponent(Register);

    component =
      fixture.componentInstance;

    fixture.detectChanges();

    await fixture.whenStable();

  });


  it('should create', () => {

    expect(component)
      .toBeTruthy();

  });

});
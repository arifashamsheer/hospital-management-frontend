import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import {
  provideHttpClient
} from '@angular/common/http';

import {
  provideHttpClientTesting,
  HttpTestingController
} from '@angular/common/http/testing';

import {
  provideRouter
} from '@angular/router';

import {
  MaterialModule
} from '../../material.module';

import {
  CommonModule
} from '@angular/common';

import {
  Patients
} from './patients';


describe('Patients', () => {

  let component: Patients;
  let fixture: ComponentFixture<Patients>;

  let httpMock: HttpTestingController;


  beforeEach(async () => {

    await TestBed.configureTestingModule({

      declarations: [
        Patients
      ],

      imports: [
        CommonModule,
        MaterialModule
      ],

      providers: [
        provideRouter([]),

        provideHttpClient(),

        provideHttpClientTesting()
      ]

    }).compileComponents();


    fixture =
      TestBed.createComponent(Patients);

    component =
      fixture.componentInstance;

    httpMock =
      TestBed.inject(
        HttpTestingController
      );

  });


  afterEach(() => {

    httpMock.verify();

  });


  it('should create', () => {

    fixture.detectChanges();

    const request =
      httpMock.expectOne(
        'http://localhost:3000/api/patients'
      );

    expect(
      request.request.method
    ).toBe('GET');


    // Fake backend response
    request.flush([
      {
        _id: '1',
        name: 'Test Patient',
        age: 30,
        gender: 'Female',
        email: 'test@gmail.com',
        phone: '0501234567',
        medicalHistory: ''
      }
    ]);


    expect(component)
      .toBeTruthy();

  });

});
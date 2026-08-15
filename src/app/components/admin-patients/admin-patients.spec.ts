import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';

import {
  MatProgressSpinnerModule
} from '@angular/material/progress-spinner';
 import{ComponentFixture,
  TestBed}
 from '@angular/core/testing';

import {
  CommonModule
} from '@angular/common';

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
  AdminPatients
} from './admin-patients';


describe('AdminPatients', () => {

  let component: AdminPatients;
  let fixture: ComponentFixture<AdminPatients>;

  beforeEach(async () => {

    await TestBed.configureTestingModule({

      declarations: [
        AdminPatients
      ],

      imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
       MatIconModule,
  MatCardModule,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatButtonModule,
  MatTableModule,
  MatPaginatorModule,
  MatProgressSpinnerModule
      ],

      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting()
      ]

    }).compileComponents();


    fixture =
      TestBed.createComponent(
        AdminPatients
      );

    component =
      fixture.componentInstance;

    fixture.detectChanges();

  });


  it('should create', () => {

    expect(component)
      .toBeTruthy();

  });

});
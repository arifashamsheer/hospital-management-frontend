import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPatient } from './add-patient';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('AddPatient', () => {
  let component: AddPatient;
  let fixture: ComponentFixture<AddPatient>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddPatient],
      imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,

        MatIconModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        MatProgressSpinnerModule
      ],

      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting()
      ]

    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPatient);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

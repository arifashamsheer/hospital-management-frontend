import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Patient } from '../../models/patient';
import { Apiservice } from '../../services/apiservice';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-admin-patients',
  standalone: false,
  templateUrl: './admin-patients.html',
  styleUrl: './admin-patients.css',
})
export class AdminPatients  implements OnInit, AfterViewInit {

  patients: Patient[] = [];

  dataSource =
    new MatTableDataSource<Patient>([]);

  displayedColumns: string[] = [
    'name',
    'email',
    'age',
    'gender',
    'phone',
    'medicalHistory',
    'actions'
  ];

  isLoading = false;
  errorMessage = '';

  searchValue = '';

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  constructor(
    private api: Apiservice,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.configureFilter();
    this.loadPatients();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator =
      this.paginator;
  }

  configureFilter(): void {
    this.dataSource.filterPredicate = (
      patient: Patient,
      filter: string
    ) => {
      const searchText =
        filter.trim().toLowerCase();

      const patientData = [
        patient.name,
        patient.email,
        patient.age,
        patient.gender,
        patient.phone,
        patient.medicalHistory
      ]
        .filter(
          value =>
            value !== null &&
            value !== undefined
        )
        .join(' ')
        .toLowerCase();

      return patientData.includes(searchText);
    };
  }

  loadPatients(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.api.getAllPatients()
      .subscribe({
        next: (response: any) => {

          this.patients =
            response.patients ??
            response.data ??
            response ??
            [];

          this.dataSource.data =
            this.patients;

          this.isLoading = false;

          this.cd.detectChanges();

          if (this.paginator) {
            this.dataSource.paginator =
              this.paginator;
          }
        },

        error: (err) => {

          console.error(
            'Patient loading error:',
            err
          );

          this.errorMessage =
            err.error?.message ||
            'Unable to load patients.';

          this.isLoading = false;
          this.cd.detectChanges();
        }
      });
  }

  applyFilter(event: Event): void {
    const input =
      event.target as HTMLInputElement;

    this.searchValue =
      input.value;

    this.dataSource.filter =
      input.value
        .trim()
        .toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator
        .firstPage();
    }
  }

  clearSearch(): void {
    this.searchValue = '';
    this.dataSource.filter = '';

    if (this.dataSource.paginator) {
      this.dataSource.paginator
        .firstPage();
    }
  }

  viewPatient(id?: string): void {
    if (!id) {
      return;
    }

    this.router.navigate([
      '/admin-patient-details',
      id
    ]);
  }

  addPatient(): void {
    this.router.navigate([
      '/add-patient'
    ]);
  }

  editPatient(id?: string): void {
    if (!id) {
      return;
    }

    this.router.navigate([
      '/edit-patient',
      id
    ]);
  }

  getInitials(name?: string): string {
    if (!name) {
      return 'P';
    }

    return name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase();
  }
  

}

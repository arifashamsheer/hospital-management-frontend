import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Doctor } from '../../models/doctor';
import { Apiservice } from '../../services/apiservice';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-admin-doctors',
  standalone: false,
  templateUrl: './admin-doctors.html',
  styleUrl: './admin-doctors.css',
})
export class AdminDoctors implements OnInit, AfterViewInit {

  doctors: Doctor[] = [];

  dataSource =
    new MatTableDataSource<Doctor>([]);

  displayedColumns: string[] = [
    'name',
    'email',
    'specialization',
    'phone',
    'availability',
    'status',
    'actions'
  ];

  searchValue = '';

  isLoading = false;
  errorMessage = '';

  updatingDoctorId = '';

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  constructor(
    private api: Apiservice,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.configureFilter();
    this.loadDoctors();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator =
      this.paginator;
  }

  configureFilter(): void {
    this.dataSource.filterPredicate = (
      doctor: Doctor,
      filter: string
    ) => {
      const searchText =
        filter.trim().toLowerCase();

      const doctorData = [
        doctor.name,
        doctor.email,
        doctor.specialization,
        doctor.phone,
        doctor.availability?.join(' '),
        doctor.isActive
          ? 'active'
          : 'inactive'
      ]
        .filter(
          value =>
            value !== null &&
            value !== undefined
        )
        .join(' ')
        .toLowerCase();

      return doctorData.includes(searchText);
    };
  }

  loadDoctors(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.cd.detectChanges();

    this.api.getAllDoctors()
      .subscribe({
        next: (response: any) => {
          console.log(
            'Doctors response:',
            response
          );

          this.doctors =
            response.doctors ??
            response.data ??
            response ??
            [];

          this.dataSource.data =
            this.doctors;

          this.isLoading = false;

          this.cd.detectChanges();

          if (this.paginator) {
            this.dataSource.paginator =
              this.paginator;
          }
        },

        error: (error) => {
          console.error(
            'Doctor loading error:',
            error
          );

          this.errorMessage =
            error.error?.message ||
            'Unable to load doctors.';

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

  changeStatus(doctor: Doctor): void {
    if (!doctor._id) {
      return;
    }

    const newStatus =
      !doctor.isActive;

    const message =
      newStatus
        ? `Activate Dr. ${doctor.name}?`
        : `Deactivate Dr. ${doctor.name}?`;

    const confirmed =
      confirm(message);

    if (!confirmed) {
      return;
    }

    this.updatingDoctorId =
      doctor._id;

    this.api
      .updateDoctorStatus(
        doctor._id,
        newStatus
      )
      .subscribe({
        next: () => {
          doctor.isActive =
            newStatus;

          this.updatingDoctorId = '';

          this.dataSource.data = [
            ...this.doctors
          ];

          this.cd.detectChanges();
        },

        error: (error) => {
          console.error(
            'Doctor status update error:',
            error
          );

          alert(
            error.error?.message ||
            'Unable to update doctor status.'
          );

          this.updatingDoctorId = '';

          this.cd.detectChanges();
        }
      });
  }

  addDoctor(): void {
    this.router.navigate([
      '/register-doctor'
    ]);
  }

  viewDoctor(id?: string): void {
    if (!id) {
      return;
    }

    this.router.navigate([
      '/admin-doctor-details',
      id
    ]);
  }

  editDoctor(id?: string): void {
    if (!id) {
      return;
    }

    this.router.navigate([
      '/edit-doctor',
      id
    ]);
  }

  getInitials(name?: string): string {
    if (!name) {
      return 'DR';
    }

    return name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map(
        word =>
          word.charAt(0)
      )
      .join('')
      .toUpperCase();
  }

  getAvailability(
    availability?: string[]
  ): string {
    if (
      !availability ||
      availability.length === 0
    ) {
      return 'Not provided';
    }

    return availability.join(', ');
  }

}



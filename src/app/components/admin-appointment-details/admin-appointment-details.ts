import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Appointment } from '../../models/appointment';
import { Apiservice } from '../../services/apiservice';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-admin-appointment-details',
  standalone: false,
  templateUrl: './admin-appointment-details.html',
  styleUrl: './admin-appointment-details.css',
})
export class AdminAppointmentDetails implements OnInit {

  appointment!: Appointment;

  isLoading = true;

  constructor(
    private api: Apiservice,
    private route: ActivatedRoute,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.loadAppointment(id);
    }

  }

  loadAppointment(id: string) {

    this.api.getAppointmentById(id).subscribe({

      next: (res) => {

        this.appointment = res;

        this.isLoading = false;
        this.cd.detectChanges();

      },

      error: () => {

        this.isLoading = false;
        this.cd.detectChanges();

      }

    });


  }
  changeStatus(status: string) {

    this.api.updateAppointmentStatus(
      this.appointment._id!,
      status
    ).subscribe({

      next: (res) => {

        this.appointment = res;

      }

    });

  }

  goBack() {

    this.router.navigate(['/admin-appointments']);

  }
}

import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import {
  NavigationEnd,
  Router
} from '@angular/router';

import { filter } from 'rxjs';

import { AuthService }
  from '../../services/auth-service';

import { Apiservice }
  from '../../services/apiservice';


@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {

  /* ========================================
     USER
  ======================================== */

  user: any = null;

  isLoggedIn = false;


  /* ========================================
     DOCTORS
  ======================================== */

  doctors: any[] = [];

  doctorStartIndex = 0;

  doctorsPerPage = 4;

  isLoadingDoctors = false;


  constructor(
    private router: Router,
    private authService: AuthService,
    private api: Apiservice,
    private cd: ChangeDetectorRef
  ) {}


  /* ========================================
     ON INIT
  ======================================== */

  ngOnInit(): void {

    this.checkLoginStatus();

    this.loadDoctors();


    /*
      Check login status again whenever
      Angular navigation finishes.
    */

    this.router.events
      .pipe(
        filter(
          event =>
            event instanceof NavigationEnd
        )
      )
      .subscribe(() => {

        this.checkLoginStatus();

      });

  }


  /* ========================================
     LOAD PUBLIC DOCTORS
  ======================================== */

  loadDoctors(): void {

    this.isLoadingDoctors = true;

    this.api
      .getPublicDoctors()
      .subscribe({

        next: (response: any) => {

          const doctorList =
            response.doctors ??
            response.data ??
            response ??
            [];


          /*
            Show only active doctors.
          */

          this.doctors =
            doctorList.filter(
              (doctor: any) =>
                doctor.isActive !== false
            );


          console.log(
            'Public doctors:',
            this.doctors
          );


          this.doctorStartIndex = 0;

          this.isLoadingDoctors = false;

          this.cd.detectChanges();

        },


        error: (error) => {

          console.error(
            'Doctor loading error:',
            error
          );

          this.doctors = [];

          this.isLoadingDoctors = false;

          this.cd.detectChanges();

        }

      });

  }


  /* ========================================
     VISIBLE DOCTORS
  ======================================== */

  get visibleDoctors(): any[] {

    return this.doctors.slice(
      this.doctorStartIndex,
      this.doctorStartIndex +
      this.doctorsPerPage
    );

  }


  /* ========================================
     NEXT DOCTORS
  ======================================== */

  nextDoctors(): void {

    const nextIndex =
      this.doctorStartIndex +
      this.doctorsPerPage;


    if (
      nextIndex <
      this.doctors.length
    ) {

      this.doctorStartIndex =
        nextIndex;

    }

  }


  /* ========================================
     PREVIOUS DOCTORS
  ======================================== */

  previousDoctors(): void {

    const previousIndex =
      this.doctorStartIndex -
      this.doctorsPerPage;


    if (previousIndex >= 0) {

      this.doctorStartIndex =
        previousIndex;

    } else {

      this.doctorStartIndex = 0;

    }

  }


  /* ========================================
     CAN GO NEXT
  ======================================== */

  canGoNext(): boolean {

    return (
      this.doctorStartIndex +
      this.doctorsPerPage <
      this.doctors.length
    );

  }


  /* ========================================
     CAN GO PREVIOUS
  ======================================== */

  canGoPrevious(): boolean {

    return (
      this.doctorStartIndex > 0
    );

  }


  /* ========================================
     LOGIN STATUS
  ======================================== */

  checkLoginStatus(): void {

    const token =
      localStorage.getItem('token');

    const savedUser =
      localStorage.getItem('user');


    this.isLoggedIn =
      Boolean(
        token &&
        savedUser
      );


    if (savedUser) {

      try {

        this.user =
          JSON.parse(savedUser);

      } catch (error) {

        console.error(
          'Invalid user data:',
          error
        );


        this.user = null;

        this.isLoggedIn = false;

      }

    } else {

      this.user = null;

    }

  }


  /* ========================================
     LOGIN
  ======================================== */

  goToLogin(): void {

    this.router.navigate([
      '/login'
    ]);

  }


  /* ========================================
     REGISTER
  ======================================== */

  goToRegister(): void {

    this.router.navigate([
      '/register'
    ]);

  }


  /* ========================================
     DASHBOARD
  ======================================== */

  goToDashboard(): void {

    if (!this.user?.role) {

      this.router.navigate([
        '/login'
      ]);

      return;

    }


    /* PATIENT */

    if (
      this.user.role ===
      'patient'
    ) {

      this.router.navigate([
        '/patient-dashboard'
      ]);

      return;

    }


    /* DOCTOR */

    if (
      this.user.role ===
      'doctor'
    ) {

      this.router.navigate([
        '/doctor-dashboard'
      ]);

      return;

    }


    /* ADMIN */

    if (
      this.user.role ===
      'admin'
    ) {

      this.router.navigate([
        '/admin-dashboard'
      ]);

      return;

    }


    this.router.navigate([
      '/login'
    ]);

  }


  /* ========================================
     LOGOUT
  ======================================== */

  logout(): void {

    this.authService.logout();


    localStorage.removeItem(
      'token'
    );

    localStorage.removeItem(
      'user'
    );


    this.user = null;

    this.isLoggedIn = false;


    this.router.navigate([
      '/'
    ]);

  }


  /* ========================================
     SERVICES SCROLL
  ======================================== */

  scrollToServices(): void {

    document
      .getElementById(
        'services'
      )
      ?.scrollIntoView({

        behavior: 'smooth',

        block: 'start'

      });

  }
  scrollToDoctors(): void {

  document
    .getElementById('doctors')
    ?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });

}


  /* ========================================
     VIEW DOCTOR
  ======================================== */

  viewDoctor(
    doctor: any
  ): void {

    console.log(
      'Selected doctor:',
      doctor
    );


    /*
      If user is not logged in,
      send them to login.
    */

    if (!this.isLoggedIn) {

      this.router.navigate([
        '/login'
      ]);

      return;

    }


    /*
      Patient can go to Book Appointment.
      We can later automatically select
      this doctor on that page.
    */

    if (
      this.user?.role ===
      'patient'
    ) {

      this.router.navigate(
        ['/book-appointment'],
        {
          queryParams: {
            doctorId:
              doctor._id
          }
        }
      );

      return;

    }


    /*
      Other users go to their dashboard.
    */

    this.goToDashboard();

  }

}
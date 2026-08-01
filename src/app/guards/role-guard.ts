import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';
import { inject } from '@angular/core';

export const roleGuard: CanActivateFn = (route, state) => {
 const authService = inject(AuthService);
  const router = inject(Router);

  const user = authService.getUser();

  const allowedRoles = route.data['roles'] as string[];

  if (user && allowedRoles.includes(user.role)) {
    return true;
  }

  return router.createUrlTree(['/access-denied']);
};

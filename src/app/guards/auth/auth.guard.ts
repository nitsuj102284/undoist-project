import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../../services/user/user.service';
import { map } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  
  const userService = inject(UserService);
  const router = inject(Router);

  return userService.userIsLoggedIn()
    .pipe(
      map(loggedIn => {
        if (loggedIn) return true;

        router.navigate(['/login'], {
          queryParams: { r: state.url !== '/' ? state.url : null }
        });

        return false;
      })
    )

};

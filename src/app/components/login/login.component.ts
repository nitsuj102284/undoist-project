import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { Subject, takeUntil, tap } from 'rxjs';
import { User } from '../../classes/generated/User';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit, OnDestroy {

  users: User[] = [];
  unsubscribe: Subject<void> = new Subject();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.initUsersListener();
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
  }

  initUsersListener(): void {
    this.userService.users$
      .pipe(
        takeUntil(this.unsubscribe),
        tap(users => this.users = users)
      )
      .subscribe();
  }

  onUserSelect(userId: string): void {
    this.userService.logIn(userId)
      .pipe(
        tap(() => {
          const returnUrl: string = this.route.snapshot.queryParamMap.get('r') || '/';
          this.router.navigate([returnUrl]);
        })
      )
      .subscribe();
  }

}

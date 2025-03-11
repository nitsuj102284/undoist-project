import { Component, OnInit } from '@angular/core';
import { User } from '../../classes/generated/User';
import { tap } from 'rxjs';
import { UserService } from '../../services/user/user.service';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nav-panel',
  imports: [
    CommonModule,
    ButtonModule,
    TooltipModule
  ],
  templateUrl: './nav-panel.component.html',
  styleUrl: './nav-panel.component.scss'
})
export class NavPanelComponent implements OnInit {

  panel: boolean = true;
  user: User;

  constructor(
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.initUserSubscription();
  }

  initUserSubscription(): void {
    this.userService.currentUser$
      .pipe(
        tap(user => this.user = user)
      )
      .subscribe();
  }
  
  onPanelToggle(): void {
    this.panel = !this.panel;
  }

}

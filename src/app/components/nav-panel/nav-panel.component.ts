import { Component, OnInit } from '@angular/core';
import { User } from '../../classes/generated/User';
import { tap } from 'rxjs';
import { UserService } from '../../services/user/user.service';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { CommonModule } from '@angular/common';
import { HelperService } from '../../services/helper/helper.service';
import { RouterModule } from '@angular/router';
import { ProjectListingComponent } from '../project-listing/project-listing.component';

@Component({
  selector: 'app-nav-panel',
  imports: [
    CommonModule,
    ButtonModule,
    RouterModule,
    TooltipModule,
    ProjectListingComponent
  ],
  templateUrl: './nav-panel.component.html',
  styleUrl: './nav-panel.component.scss'
})
export class NavPanelComponent implements OnInit {

  panel: boolean = true;
  specialKeySymbol: string;
  user: User;

  constructor(
    private helperService: HelperService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.initUserSubscription();
    this.setSpecialKeySymbol();
  }

  initUserSubscription(): void {
    this.userService.currentUser$
      .pipe(
        tap(user => this.user = user)
      )
      .subscribe();
  }
  
  setSpecialKeySymbol(): void {
    this.specialKeySymbol = this.helperService.getSpecialKeySymbol();
  }
  
  onPanelToggle(): void {
    this.panel = !this.panel;
  }

}

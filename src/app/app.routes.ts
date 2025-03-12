import { Routes } from '@angular/router';
import { LoginViewComponent } from './views/login-view/login-view.component';
import { authGuard } from './guards/auth/auth.guard';
import { InboxViewComponent } from './views/inbox-view/inbox-view.component';

export const routes: Routes = [
    { path: 'login', component: LoginViewComponent, data: { viewClass: 'login', kiosk: true }},
    {
        path: '',
        canActivate: [authGuard],
        canActivateChild: [authGuard],
        children: [
            { path: 'inbox', component: InboxViewComponent, data: { viewClass: 'inbox' }}
        ],
    },
    { path: '**', redirectTo: '/' }
];

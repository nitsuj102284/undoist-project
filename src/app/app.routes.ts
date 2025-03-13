import { Routes } from '@angular/router';
import { LoginViewComponent } from './views/login-view/login-view.component';
import { authGuard } from './guards/auth/auth.guard';
import { ProjectViewComponent } from './views/project-view/project-view/project-view.component';

export const routes: Routes = [
    { path: 'login', component: LoginViewComponent, data: { viewClass: 'login', kiosk: true }},
    {
        path: '',
        canActivate: [authGuard],
        canActivateChild: [authGuard],
        children: [
            { path: 'inbox', component: ProjectViewComponent, data: { viewClass: 'inbox', projectView: 'default' }},
            { 
                path: 'project',
                children: [
                    { path: ':id', component: ProjectViewComponent, data: { viewClass: 'project' }}
                ]
            }
        ],
    },
    { path: '**', redirectTo: '/' }
];

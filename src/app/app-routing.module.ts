import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from './containers/home/components/home/home.component';
import {RoleGuardCanLoadService} from './services/role-guard-can-load.service';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'rxjs',
    loadChildren: () => import('./containers/rxjs/rxjs.module').then(m => m.RxjsModule),
    canLoad: [RoleGuardCanLoadService], data: { expectedRole: ['Admin', 'SuperAdmin'] }
  },
  {
    path: 'pwa',
    loadChildren: () => import('./containers/pwa/pwa.module').then(m => m.PwaModule),
    canLoad: [RoleGuardCanLoadService], data: { expectedRole: ['SuperAdmin'] }
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

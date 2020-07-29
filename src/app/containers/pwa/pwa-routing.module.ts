import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PwaComponent} from './components/pwa/pwa.component';

const routes: Routes = [
  {
    path: '',
    component: PwaComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PwaRoutingModule { }

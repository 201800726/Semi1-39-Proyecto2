import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '../guards/auth.guard';

import { PagesComponent } from './pages.component';

const routes: Routes = [
  {
    path: 'home',
    component: PagesComponent,
    canActivate: [AuthGuard],
    children: [
      //{ path: '', component: DashboardComponent, data: { title: 'Dashboard' } }, //TODO add child paths
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}

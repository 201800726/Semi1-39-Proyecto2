import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { WebcamModule } from 'ngx-webcam';

import { PagesComponent } from './pages.component';
import { CameraComponent } from '../components/camera/camera.component';

@NgModule({
  declarations: [PagesComponent, CameraComponent],
  imports: [CommonModule, RouterModule, WebcamModule],
  exports: [PagesComponent],
})
export class PagesModule {}

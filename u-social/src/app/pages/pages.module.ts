import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { WebcamModule } from 'ngx-webcam';
import { FlexLayoutModule } from '@angular/flex-layout';

import { PagesComponent } from './pages.component';
import { HomeNavComponent } from '../components/home-nav/home-nav.component';

import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialogModule } from '@angular/material/dialog';
import { PasswordDialogComponent } from '../components/password-dialog/password-dialog.component';

@NgModule({
  declarations: [PagesComponent, HomeNavComponent, PasswordDialogComponent],
  entryComponents: [PasswordDialogComponent],
  imports: [
    FlexLayoutModule,
    CommonModule,
    RouterModule,
    WebcamModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [PagesComponent],
})
export class PagesModule {}

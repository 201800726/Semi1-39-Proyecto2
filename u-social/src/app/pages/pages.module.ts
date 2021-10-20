import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

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
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatStepperModule } from '@angular/material/stepper';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDividerModule } from '@angular/material/divider';
import { MatBadgeModule } from '@angular/material/badge';

import { PasswordDialogComponent } from '../components/password-dialog/password-dialog.component';
import { CameraDialogComponent } from '../auth/camera-dialog/camera-dialog.component';
import { FeedComponent } from './feed/feed.component';
import { ChatComponent } from './chat/chat.component';
import { PublicationComponent } from '../components/publication/publication.component';
import { FilterComponent } from '../components/filter/filter.component';
import { FriendComponent } from '../components/friend/friend.component';

@NgModule({
  declarations: [
    PagesComponent,
    HomeNavComponent,
    PublicationComponent,
    PasswordDialogComponent,
    FeedComponent,
    ChatComponent,
    FriendComponent,
    FilterComponent,
  ],
  entryComponents: [PasswordDialogComponent, CameraDialogComponent],
  imports: [
    HttpClientModule,
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
    MatTooltipModule,
    MatMenuModule,
    MatStepperModule,
    MatCardModule,
    MatGridListModule,
    MatAutocompleteModule,
    MatDividerModule,
    MatBadgeModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [PagesComponent],
})
export class PagesModule {}

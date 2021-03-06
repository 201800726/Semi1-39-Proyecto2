import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { AuthModule } from './auth/auth.module';
import { PagesModule } from './pages/pages.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    AuthModule,
    PagesModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

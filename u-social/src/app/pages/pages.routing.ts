import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '../guards/auth.guard';

import { ChatComponent } from './chat/chat.component';
import { FeedComponent } from './feed/feed.component';
import { PagesComponent } from './pages.component';

const routes: Routes = [
  {
    path: 'home',
    component: PagesComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'feed',
        component: FeedComponent,
        data: { title: 'Feed' },
      },
      {
        path: 'chat',
        component: ChatComponent,
        data: { title: 'Chat' },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}

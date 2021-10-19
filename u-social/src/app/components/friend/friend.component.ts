import { Component, Input, OnInit } from '@angular/core';
import { UserModel } from 'src/models/user.model';

@Component({
  selector: 'app-friend',
  templateUrl: './friend.component.html',
  styleUrls: ['./friend.component.css'],
})
export class FriendComponent implements OnInit {
  @Input('user') user!: UserModel;
  @Input('find') find!: boolean;

  constructor() {}

  ngOnInit(): void {}
}

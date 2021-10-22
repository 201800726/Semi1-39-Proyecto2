import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UserModel } from 'src/models/user.model';

@Component({
  selector: 'app-friend',
  templateUrl: './friend.component.html',
  styleUrls: ['./friend.component.css'],
})
export class FriendComponent implements OnInit {
  @Input('user') user!: UserModel;
  @Input('find') find!: number;
  @Output('friend') friend: EventEmitter<UserModel>;
  @Output('request') request: EventEmitter<any>;

  constructor() {
    this.friend = new EventEmitter<UserModel>();
    this.request = new EventEmitter<any>();
  }

  ngOnInit(): void {}

  public response(status: number) {
    const request_answer = {
      user: this.user,
      response: status,
    };
    this.request.emit(request_answer);
  }
  public show(): void {
    this.friend.emit(this.user);
  }
}

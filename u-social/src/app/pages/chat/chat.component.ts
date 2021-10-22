import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ChatService } from 'src/app/services/chat.service';
import { FriendshipService } from 'src/app/services/friendship.service';
import { DayModel } from 'src/models/day.model';
import { MessageModel } from 'src/models/message.model';
import { UserModel } from 'src/models/user.model';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  providers: [DatePipe],
})
export class ChatComponent implements OnInit {
  public friends: UserModel[];
  public conversation: DayModel[];

  public new_message: MessageModel;

  public user: UserModel;
  public friend: UserModel;

  constructor(
    private _datepipe: DatePipe,
    private _friendshipService: FriendshipService,
    public _chatService: ChatService,
    private _snackBar: MatSnackBar
  ) {
    this.friend = new UserModel();
    this.user = new UserModel();
    this.new_message = new MessageModel();
    this.friends = [];
    this.conversation = [];
  }

  async ngOnInit(): Promise<void> {
    const container = localStorage.getItem('user');
    if (container !== null) this.user = <UserModel>JSON.parse(container);
    await this.getFriends();
  }

  public async getFriends() {
    try {
      const data = await this._friendshipService.getFriends(this.user.username);
      if (data['code'] === '200') {
        this.friends = data['data'];
      }
    } catch (error) {
      console.log(error);
    }
  }

  sendMessage() {
    try {
      this.new_message.emisor = this.user.username;
      this.new_message.receptor = this.friend.username;
      const date = new Date();
      const hours = date.getHours();
      const format = hours >= 12 ? 'pm' : 'am';
      this.new_message.date = this._datepipe
        .transform(new Date(), 'yyyy/MM/dd')
        ?.toString();

      this.new_message.time =
        this._datepipe.transform(new Date(), 'hh:mm ', 'en-us')?.toString() +
        format;
      this._chatService.sendMessage(this.new_message);
      this.new_message = new MessageModel();
    } catch (error) {
      this.showSnackbar();
    }
  }

  async showChat(friend: UserModel) {
    try {
      this.friend = friend;
      localStorage.setItem('friend', JSON.stringify(this.friend));
      await this._chatService.showChat();
    } catch (error) {
      this.showSnackbar();
      console.log(error);
    }
  }

  showSnackbar(message: string = 'Something went wrong :c') {
    this._snackBar.open(message, 'CLOSE', { duration: 3000 });
  }
}

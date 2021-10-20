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
    private _chatService: ChatService,
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
      const data = await this._friendshipService.getFriends(
        this.user.username || ''
      );
      if (data['code'] === '200') {
        this.friends = data['data'];
      }
    } catch (error) {
      console.log(error);
    }
  }

  sendMessage() {
    const date = new Date();
    const hours = date.getHours();
    const format = hours >= 12 ? 'pm' : 'am';
    this.new_message.date = this._datepipe
      .transform(new Date(), 'yyyy-MM-dd')
      ?.toString();

    this.new_message.time =
      this._datepipe.transform(new Date(), 'hh:mm ', 'en-us')?.toString() +
      format;
    console.log(this.new_message, this.user.username, this.friend.username);
    //TODO send info to socket
  }

  async showChat(friend: UserModel) {
    this.conversation = [];
    this.friend = friend;
    const dayholder: DayModel = new DayModel([]);
    try {
      const data = await this._chatService.getMessages(
        this.user.username || '',
        this.friend.username || ''
      );
      if (data['code'] === '200') {
        let date = '';
        data['data'].forEach((message: MessageModel) => {
          message.emmiter = 1;
          if (message.emisor === this.user.username) message.emmiter = 2;
          if (date != message.date) {
            const day: DayModel = new DayModel([]);
            date = message.date || '';
            day.date = message.date;
            this.conversation.push(day);
          }
          const index = this.conversation.indexOf(
            this.conversation.find((day) => day.date == message.date) ||
              dayholder
          );
          this.conversation[index].messages?.push(message);
        });
      } else {
        this.showSnackbar("Couldn't get any messages :C");
      }
    } catch (error) {
      this.showSnackbar('Something went wrong :o');
      console.log(error);
    }
  }

  showSnackbar(message: string) {
    this._snackBar.open(message, 'CLOSE', { duration: 3000 });
  }
}

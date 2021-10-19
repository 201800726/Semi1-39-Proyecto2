import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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

  constructor(private _datepipe: DatePipe) {
    this.friend = new UserModel();
    this.user = new UserModel();
    this.new_message = new MessageModel();
    this.friends = [
      {
        profile_picture:
          'https://www.famousbirthdays.com/faces/horan-niall-image.jpg',
        username: 'niallito',
        name: 'Nial Horan',
        bot_mode: true,
      },
      {
        profile_picture:
          'https://imagesvc.meredithcorp.io/v3/mm/image?url=https%3A%2F%2Fstatic.onecms.io%2Fwp-content%2Fuploads%2Fsites%2F21%2F2021%2F08%2F09%2FGettyImages-1149239562-2000.jpg',
        username: 'selengaG',
        name: 'Selena Gómez',
      },
    ];

    this.conversation = [
      {
        messages: [
          {
            message: 'Hi! o/ how are u?',
            date: '25/10/21',
            time: '4:30 pm',
            emmiter: 1,
          },
          {
            message: "I'm fine c: what about you?",
            date: '25/10/21',
            time: '4:35 pm',
            emmiter: 2,
          },
        ],
        date: '25/10/21',
      },
      {
        messages: [
          {
            message: "That's cool, I'm also doing good.",
            date: '26/10/21',
            time: '1:00 pm',
            emmiter: 1,
          },
        ],
        date: '26/10/21',
      },
    ];
  }

  ngOnInit(): void {
    const container = localStorage.getItem('user');
    if (container !== null) this.user = <UserModel>JSON.parse(container);
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
    console.log(this.new_message, this.user.name);
    //TODO send info to socket
  }

  showChat(friend: UserModel) {
    //TODO open friend's chat
    //TODO map data to conversation format
    console.log(friend);
  }
}

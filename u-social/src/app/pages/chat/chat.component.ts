import { Component, OnInit } from '@angular/core';
import { UserModel } from 'src/models/user.model';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit {
  public friends: UserModel[];

  constructor() {
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
  }

  ngOnInit(): void {}
}

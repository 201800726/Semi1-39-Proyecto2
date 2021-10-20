import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { MessageModel } from 'src/models/message.model';
import { SocketService } from './socket.service';
import { DayModel } from 'src/models/day.model';
import { UserModel } from 'src/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  public url: string;
  public conversation: DayModel[];

  constructor(private _httpClient: HttpClient, private socket: SocketService) {
    this.url = `${environment.url}/message`;
    this.conversation = [];
    this.receiveMessage();
  }

  public sendMessage(message: MessageModel) {
    this.socket.io.emit('message:client', message);
  }

  public receiveMessage() {
    this.socket.io.on('message:server', (conversation) => {
      this.showChat();
    });
  }

  public async showChat() {
    let friend = new UserModel();
    let container = localStorage.getItem('friend');
    if (container !== null) friend = <UserModel>JSON.parse(container);
    let user = new UserModel();
    container = localStorage.getItem('user');
    if (container !== null) user = <UserModel>JSON.parse(container);
    this.conversation = [];
    const dayholder: DayModel = new DayModel([]);
    try {
      const data = await this.getMessages(
        user.username || '',
        friend.username || ''
      );
      if (data['code'] === '200') {
        let date = '';
        data['data'].forEach((message: MessageModel) => {
          message.emmiter = 1;
          if (message.emisor === user.username) message.emmiter = 2;
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
      }
    } catch (error) {
      console.log(error);
    }
  }

  public async getMessages(emmiter: string, receiver: string): Promise<any> {
    const body = {
      emmiter: emmiter,
      receiver: receiver,
    };
    const json = JSON.stringify(body);
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return await this._httpClient
      .post(`${this.url}/all`, json, { headers })
      .toPromise();
  }
}

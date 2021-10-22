import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { MessageModel } from 'src/models/message.model';
import { SocketService } from './socket.service';
import { DayModel } from 'src/models/day.model';
import { UserModel } from 'src/models/user.model';
import { ConversationModel } from 'src/models/conversation.model';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  public url: string;
  public conversation: ConversationModel;

  constructor(private _httpClient: HttpClient, private socket: SocketService) {
    this.url = `${environment.url}/message`;
    this.conversation = new ConversationModel([]);
    this.receiveMessage();
  }

  public sendMessage(message: MessageModel) {
    this.socket.io.emit('message:client', message);
  }

  public receiveMessage() {
    this.socket.io.on('message:server', (message) => {
      if (
        (message.emisor == this.conversation.emmiter &&
          message.receptor == this.conversation.receiver) ||
        (message.emisor == this.conversation.receiver &&
          message.receptor == this.conversation.emmiter)
      ) {
        this.pushMessage(message);
      }
      //this.showChat();
    });
  }

  private pushMessage(message: MessageModel) {
    const dayholder: DayModel = new DayModel([]);
    message.emmiter = 1;
    if (message.emisor === this.conversation.emmiter) message.emmiter = 2;
    const index = this.conversation.days.indexOf(
      this.conversation.days.find((day) => day.date == message.date) ||
        dayholder
    );
    if (index < 0) {
      dayholder.date = message.date;
      dayholder.messages.push(message);
      this.conversation.days.push(dayholder);
    } else {
      this.conversation.days[index].messages?.push(message);
    }
  }

  public async showChat() {
    let friend = new UserModel();
    let container = localStorage.getItem('friend');
    if (container !== null) friend = <UserModel>JSON.parse(container);
    let user = new UserModel();
    container = localStorage.getItem('user');
    if (container !== null) user = <UserModel>JSON.parse(container);
    this.conversation = new ConversationModel(
      [],
      user.username,
      friend.username
    );
    try {
      const data = await this.getMessages(
        user.username || '',
        friend.username || ''
      );
      if (data['code'] === '200') {
        let date = '';
        data['data'].forEach((message: MessageModel) => {
          if (date != message.date) {
            const day: DayModel = new DayModel([]);
            date = message.date || '';
            day.date = message.date;
            this.conversation.days.push(day);
          }
          this.pushMessage(message);
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

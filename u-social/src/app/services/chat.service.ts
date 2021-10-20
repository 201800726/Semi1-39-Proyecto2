import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  public url: string;

  constructor(private _httpClient: HttpClient) {
    this.url = `${environment.url}/message`;
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

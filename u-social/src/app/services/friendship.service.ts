import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FriendshipService {
  public url: string;

  constructor(private _httpClient: HttpClient) {
    this.url = `${environment.url}/friends`;
  }

  public async getRequests(username: string = ''): Promise<any> {
    return await this._httpClient
      .get(`${this.url}/getRequests/${username}`)
      .toPromise();
  }

  public async getFriends(username: string = ''): Promise<any> {
    return await this._httpClient
      .get(`${this.url}/getFriends/${username}`)
      .toPromise();
  }

  public async getNoFriends(username: string = ''): Promise<any> {
    return await this._httpClient
      .get(`${this.url}/getNoFriends/${username}`)
      .toPromise();
  }

  public async sendFriendshipRequest(
    user: string = '',
    friend: string = '',
    option: number = 2
  ): Promise<any> {
    const body = {
      user: user,
      friend: friend,
    };
    const json = JSON.stringify(body);
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    switch (option) {
      case 0:
        return await this._httpClient
          .put(`${this.url}/`, json, { headers })
          .toPromise();
      case 1:
        return await this._httpClient
          .post(`${this.url}/delete`, json, { headers })
          .toPromise();
      default:
        return await this._httpClient
          .post(`${this.url}/create`, json, { headers })
          .toPromise();
    }
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FriendshipService {
  public url: string;

  constructor(private _httpClient: HttpClient) {
    this.url = `${environment.url}/friend`;
  }

  public async getFriends(username: string): Promise<any> {
    const user = {
      username: username,
    };
    const json = JSON.stringify(user);
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return await this._httpClient
      .post(`${this.url}/friends`, json, { headers })
      .toPromise();
  }
}

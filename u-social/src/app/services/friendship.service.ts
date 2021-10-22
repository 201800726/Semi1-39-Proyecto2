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

  public async getFriends(username: string): Promise<any> {
    return await this._httpClient
      .get(`${this.url}/getFriends/${username}`)
      .toPromise();
  }

  public async getNoFriends(username: string): Promise<any> {
    return await this._httpClient
      .get(`${this.url}/getNoFriends/${username}`)
      .toPromise();
  }
}

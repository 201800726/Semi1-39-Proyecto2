import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { UserModel } from 'src/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  public url: string;

  constructor(private _httpClient: HttpClient) {
    this.url = `${environment.url}/user`;
  }

  public async signup(user: UserModel): Promise<any> {
    const new_user = {
      name: user.name,
      email: user.e_mail,
      username: user.username,
      image: user.profile_picture,
      password: user.password,
    };
    const json = JSON.stringify(new_user);
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return await this._httpClient
      .post(`${this.url}/register`, json, { headers })
      .toPromise();
  }
}

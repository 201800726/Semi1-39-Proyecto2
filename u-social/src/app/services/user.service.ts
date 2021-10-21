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

  public async normalSignin(user: UserModel): Promise<any> {
    const json = JSON.stringify(user);
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return await this._httpClient
      .post(`${this.url}/login`, json, { headers })
      .toPromise();
  }

  public async recognitionSinging(username: string): Promise<any> {
    return await this._httpClient
      .get(`${this.url}/photo/${username}`)
      .toPromise();
  }

  public async facialRecognition(image1: string, image2: string): Promise<any> {
    const body = {
      image1: image1,
      image2: image2,
      similarity: 0,
    };
    const json = JSON.stringify(body);
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return await this._httpClient
      .post(
        `https://8fqx01vu7k.execute-api.us-east-2.amazonaws.com/login`,
        json,
        { headers }
      )
      .toPromise();
  }
}

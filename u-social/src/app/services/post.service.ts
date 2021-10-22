import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  public url: string;
  constructor(private _httpClient: HttpClient) {
    this.url = `${environment.url}/post`;
  }

  public async getPosts(username: string = ''): Promise<any> {
    return await this._httpClient.get(`${this.url}/${username}`).toPromise();
  }
}

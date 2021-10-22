import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { PostModel } from 'src/models/post.model';

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

  public async translatePost(comment: string = ''): Promise<any> {
    const body = {
      text: comment,
    };
    const json = JSON.stringify(body);
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return await this._httpClient
      .post(`${this.url}/translate`, json, { headers })
      .toPromise();
  }

  public async post(post: PostModel): Promise<any> {
    const body = {
      text: post.comment,
      image: post.pictureB64,
      username: post.username,
    };
    const json = JSON.stringify(body);
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return await this._httpClient
      .post(`${this.url}/create`, json, { headers })
      .toPromise();
  }
}

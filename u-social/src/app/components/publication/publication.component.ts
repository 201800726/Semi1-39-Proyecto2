import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PostService } from 'src/app/services/post.service';
import { PostModel } from 'src/models/post.model';

@Component({
  selector: 'app-publication',
  templateUrl: './publication.component.html',
  styleUrls: ['./publication.component.css'],
})
export class PublicationComponent implements OnInit {
  @Input('post') post!: PostModel;
  public translated_text: string;
  public show_original: boolean;

  constructor(
    private _postService: PostService,
    private _snackBar: MatSnackBar
  ) {
    this.translated_text = '';
    this.show_original = true;
  }

  ngOnInit(): void {}

  public async translatePost() {
    try {
      const data = await this._postService.translatePost(this.post.comment);
      if (data['code'] == '200') {
        this.translated_text = data['data']['TranslatedText'];
        this.show_original = false;
      }
    } catch (error) {
      this.showSnackbar();
    }
  }

  showSnackbar(message: string = 'Unable to translate post :c') {
    this._snackBar.open(message, 'CLOSE', { duration: 3000 });
  }
}

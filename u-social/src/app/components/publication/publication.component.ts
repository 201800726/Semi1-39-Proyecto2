import { Component, Input, OnInit } from '@angular/core';
import { PostModel } from 'src/models/post.model';

@Component({
  selector: 'app-publication',
  templateUrl: './publication.component.html',
  styleUrls: ['./publication.component.css'],
})
export class PublicationComponent implements OnInit {
  @Input('post') post!: PostModel;

  constructor() {}

  ngOnInit(): void {}
}

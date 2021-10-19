import { Component, Input, OnInit } from '@angular/core';
import { PublicationModel } from 'src/models/publication.model';

@Component({
  selector: 'app-publication',
  templateUrl: './publication.component.html',
  styleUrls: ['./publication.component.css'],
})
export class PublicationComponent implements OnInit {
  @Input('publication') publication!: PublicationModel;

  constructor() {}

  ngOnInit(): void {}
}

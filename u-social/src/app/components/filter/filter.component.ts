import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css'],
})
export class FilterComponent {
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  filterCtrl = new FormControl();
  filteredfilters!: Observable<string[]>;
  filters: string[] = [];
  allfilters: string[] = [];

  @ViewChild('filterInput') filterInput!: ElementRef<HTMLInputElement>;
  @Output('labels') labels: EventEmitter<string[]>;

  constructor(private _postService: PostService) {
    this.labels = new EventEmitter<string[]>();
  }

  private addFilters() {
    this.filteredfilters = this.filterCtrl.valueChanges.pipe(
      startWith(null),
      map((filter: string | null) =>
        filter ? this._filter(filter) : this.allfilters.slice()
      )
    );
  }

  ngOnInit(): void {
    this.getFilters();
  }

  private async getFilters() {
    try {
      this.allfilters = [];
      const data = await this._postService.getLabels();
      if (data['code'] === '200') {
        data['data'].forEach((label: any) => {
          this.allfilters.push(label.label);
          this.addFilters();
        });
      }
    } catch (error) {}
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      this.filters.push(value);
    }
    event.chipInput!.clear();

    this.filterCtrl.setValue(null);
    this.labels.emit(this.filters);
  }

  remove(filter: string): void {
    const index = this.filters.indexOf(filter);

    if (index >= 0) {
      this.filters.splice(index, 1);
    }
    this.labels.emit(this.filters);
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.filters.push(event.option.viewValue);
    this.filterInput.nativeElement.value = '';
    this.filterCtrl.setValue(null);
    this.labels.emit(this.filters);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allfilters.filter((filter) =>
      filter.toLowerCase().includes(filterValue)
    );
  }
}

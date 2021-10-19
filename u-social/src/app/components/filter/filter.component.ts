import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

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
  filteredfilters: Observable<string[]>;
  filters: string[] = ['All'];
  allfilters: string[] = ['Summer', 'River', 'Pet', 'Crowd', 'People'];

  @ViewChild('filterInput') filterInput!: ElementRef<HTMLInputElement>;

  constructor() {
    this.filteredfilters = this.filterCtrl.valueChanges.pipe(
      startWith(null),
      map((filter: string | null) =>
        filter ? this._filter(filter) : this.allfilters.slice()
      )
    );
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our filter
    if (value) {
      this.filters.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();

    this.filterCtrl.setValue(null);
  }

  remove(filter: string): void {
    const index = this.filters.indexOf(filter);

    if (index >= 0) {
      this.filters.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.filters.push(event.option.viewValue);
    this.filterInput.nativeElement.value = '';
    this.filterCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allfilters.filter((filter) =>
      filter.toLowerCase().includes(filterValue)
    );
  }
}

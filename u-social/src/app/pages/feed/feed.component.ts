import {
  StepperSelectionEvent,
  STEPPER_GLOBAL_OPTIONS,
} from '@angular/cdk/stepper';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: {
        displayDefaultIndicatorType: false,
      },
    },
  ],
})
export class FeedComponent implements OnInit {
  @ViewChild('stepper')
  stepper!: MatStepper;
  public stepSelected: string;
  public next: boolean;

  constructor() {
    this.stepSelected = 'Friends';
    this.next = false;
  }

  ngOnInit(): void {}
  ngAfterViewInit() {
    this.stepper.selectedIndex = 1;
  }

  selectionChange(event: StepperSelectionEvent) {
    this.stepSelected = event.selectedStep.label;
    switch (this.stepSelected) {
      case 'Publications':
        this.next = true;
        break;
      case 'Friends':
        this.next = false;

        break;
    }
  }
}

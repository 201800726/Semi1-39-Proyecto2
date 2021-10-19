import {
  StepperSelectionEvent,
  STEPPER_GLOBAL_OPTIONS,
} from '@angular/cdk/stepper';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatStepper } from '@angular/material/stepper';
import { PublicationModel } from 'src/models/publication.model';

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

  public create_content: boolean;
  public add_comment: boolean;

  public new_publication: PublicationModel;
  public myForm: FormGroup;

  constructor(private _snackBar: MatSnackBar, public fb: FormBuilder) {
    this.stepSelected = 'Friends';
    this.next = false;
    this.create_content = false;
    this.add_comment = false;
    this.new_publication = new PublicationModel();
    this.myForm = this.fb.group({
      img: [null],
    });
  }

  ngOnInit(): void {}
  ngAfterViewInit() {
    this.stepper.selectedIndex = 1;
  }

  cancel() {
    this.create_content = false;
    this.add_comment = false;
    this.new_publication = new PublicationModel();

    //TODO limpiar la publicacion
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

  onFileSelected(event: any) {
    try {
      const file = (event.target as HTMLInputElement).files![0];
      if (file) {
        var temporal: string[] = file.name.split('.');
        var extension = temporal[1].toLocaleLowerCase();
        let extensiones = ['jpg', 'png', 'jpeg', 'ico', 'svg'];
        if (extensiones.indexOf(extension) == -1) {
          throw new Error();
        } else {
          this.convert64(file);
          this.myForm.patchValue({
            img: file,
          });

          this.myForm.get('img')?.updateValueAndValidity();
          const reader = new FileReader();
          reader.onload = () => {
            this.new_publication.picture = reader.result as string;
          };
          reader.readAsDataURL(file);
        }
      }
    } catch (error) {
      this.showSnackbar('Extension not allowed :o');
    }
  }

  private convert64(photo: any) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const base64 = e.target.result;
      this.new_publication.pictureB64 = base64.split(',')[1];
    };
    reader.readAsDataURL(photo);
  }

  showSnackbar(message: string) {
    this._snackBar.open(message, 'CLOSE', { duration: 3000 });
  }
}

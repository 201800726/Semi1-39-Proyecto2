import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { MediaObserver, MediaChange } from '@angular/flex-layout';
import { Subscription } from 'rxjs';

import { UserModel } from 'src/models/user.model';
import { Router } from '@angular/router';

import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CameraDialogComponent } from '../camera-dialog/camera-dialog.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, OnDestroy {
  mediaSub: Subscription | any;

  public hide: boolean;
  public deviceXs: boolean;

  public user: UserModel;
  public new_user: UserModel;
  public password: string;
  public new_password: string;
  public confirmed: string;
  public profile_picture: boolean;

  public uploadedPhoto: string;
  public myForm: FormGroup;

  constructor(
    private _router: Router,
    private _snackBar: MatSnackBar,
    public mediaObserver: MediaObserver,
    public fb: FormBuilder,
    public dialog: MatDialog
  ) {
    this.hide = true;
    this.mediaSub = null;
    this.deviceXs = false;
    this.user = new UserModel();
    this.new_user = new UserModel();
    this.password = '';
    this.new_password = '';
    this.confirmed = '';
    this.profile_picture = false;
    this.myForm = this.fb.group({
      img: [null],
    });
    this.uploadedPhoto = '';
  }

  ngOnInit(): void {
    this.mediaSub = this.mediaObserver.media$.subscribe(
      (result: MediaChange) => {
        this.deviceXs = result.mqAlias === 'xs' ? true : false;
      }
    );
  }

  ngOnDestroy(): void {
    this.mediaSub.unsubscribe();
  }

  showSnackbar(message: string) {
    this._snackBar.open(message, 'CLOSE', { duration: 3000 });
  }

  public async signin(Form: NgForm): Promise<void> {
    try {
    } catch (error) {
      Form.resetForm();
      this.showSnackbar('Incorrect username or password.');
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
            this.uploadedPhoto = reader.result as string;
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
      this.new_user.profile_picture = base64.split(',')[1];
      this.profile_picture = true;
    };
    reader.readAsDataURL(photo);
  }

  public async signup(Form: NgForm): Promise<void> {
    try {
      if (!(this.new_password === this.confirmed)) {
        this.showSnackbar("Password confirmation doesn't match :o");
        throw new Error();
      }
      if (!this.profile_picture) {
        this.showSnackbar('Profile picture required :o');
        throw new Error();
      }
      this.new_user = new UserModel();
      this.showSnackbar('Now you have an account, Signin! c:');
      Form.resetForm();
    } catch (error) {}
  }

  openDialogCamera() {
    const dialogRef = this.dialog.open(CameraDialogComponent, {});

    dialogRef.afterClosed().subscribe(async (result) => {
      console.log(result);
    });
  }
}

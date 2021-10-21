import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { MediaObserver, MediaChange } from '@angular/flex-layout';
import { Subscription } from 'rxjs';
import { Md5 } from 'ts-md5';

import { UserModel } from 'src/models/user.model';
import { Router } from '@angular/router';

import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CameraDialogComponent } from '../camera-dialog/camera-dialog.component';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, OnDestroy {
  mediaSub: Subscription | any;

  public hide: boolean;
  public deviceXs: boolean;
  public normal_login: boolean;

  public user: UserModel;
  public new_user: UserModel;
  public password: string;
  public new_password: string;
  public confirmed: string;
  public profile_picture: boolean;
  public new_picture: any;

  public uploadedPhoto: string;
  public myForm: FormGroup;

  constructor(
    private _router: Router,
    private _snackBar: MatSnackBar,
    public mediaObserver: MediaObserver,
    public fb: FormBuilder,
    public dialog: MatDialog,
    private _userService: UserService
  ) {
    this.hide = true;
    this.mediaSub = null;
    this.deviceXs = false;
    this.normal_login = true;
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

  showSnackbar(message: string = 'Something went wrong :c') {
    this._snackBar.open(message, 'CLOSE', { duration: 5000 });
  }

  public async signin(Form: NgForm): Promise<void> {
    try {
      const md5 = new Md5();
      this.user.password = '' + md5.appendStr(this.password).end();
      if (this.normal_login) {
        //TODO service normal login
      } else {
        if (!this.new_user.profile_picture)
          this.showSnackbar('You need a photo to login!');
        //TODO get profile_picture from user
        //TODO send profile_picture and new picture(new_user.profile_picture) to apigatway with lambda
        localStorage.setItem('user', JSON.stringify(this.user));
        this._router.navigate(['/home']);
      }
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
      const md5 = new Md5();
      this.new_user.password = '' + md5.appendStr(this.new_password).end();
      const data = await this._userService.signup(this.new_user);
      if (data['code'] === '200') {
        this.uploadedPhoto = '';
        this.new_picture = '';
        this.new_user = new UserModel();
        this.showSnackbar(
          "Now you have an account, we've send you an email to confirm! c:"
        );
        Form.resetForm();
      } else {
        this.showSnackbar();
      }
    } catch (error) {
      this.showSnackbar();
    }
  }

  openDialogCamera() {
    const dialogRef = this.dialog.open(CameraDialogComponent, {
      data: {
        image: this.new_picture,
        url: '',
      },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (!result) this.profile_picture = false;
      this.new_user.profile_picture = result.imageAsBase64;
      this.profile_picture = true;
      this.new_picture = result.imageAsDataUrl;
      this.uploadedPhoto = '';
    });
  }
}

import { Component } from '@angular/core';

import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

import { Md5 } from 'ts-md5';

import { UserModel } from 'src/models/user.model';
import { PasswordDialogComponent } from '../password-dialog/password-dialog.component';

import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CameraDialogComponent } from 'src/app/auth/camera-dialog/camera-dialog.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-home-nav',
  templateUrl: './home-nav.component.html',
  styleUrls: ['./home-nav.component.css'],
})
export class HomeNavComponent {
  public user: UserModel;
  public user_updated: UserModel;

  public editing: boolean;
  public new_picture: string;
  public prev_picture: string | undefined;

  public myForm: FormGroup;

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private _router: Router,
    public fb: FormBuilder,
    private _userService: UserService
  ) {
    this.user = new UserModel();
    this.user_updated = new UserModel();
    this.editing = false;
    this.new_picture = '';
    this.prev_picture = '';
    this.myForm = this.fb.group({
      img: [null],
    });
  }

  async ngOnInit(): Promise<void> {
    const container = localStorage.getItem('user');
    if (container !== null) this.user = <UserModel>JSON.parse(container);
    this.getCounters();
    this.user.picture_url =
      'https://proyecto2-39-semi1.s3.us-east-2.amazonaws.com/';
    this.user_updated = this.user;
    this.prev_picture = this.user.profile_picture;
  }

  private async getCounters() {
    try {
      const data = await this._userService.getCounters(
        this.user.username || ''
      );
      if (data['code'] === '200') {
        this.user.friends = data['data']['friends'];
        this.user.posts = data['data']['posts'];
      }
    } catch (error) {}
  }

  logOut() {
    localStorage.clear();
    this._router.navigate(['/login']);
  }

  updateUser() {
    const dialogRef = this.dialog.open(PasswordDialogComponent, {});

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        try {
          const md5 = new Md5();
          this.user.password = '' + md5.appendStr(result).end();
          console.log(this.user_updated, this.prev_picture, this.new_picture);
          const update = await this._userService.update(
            this.user_updated,
            this.prev_picture,
            this.new_picture
          );
          this.editing = false;
          this.user = this.user_updated;
          this.prev_picture = this.user.profile_picture;

          const data = await this._userService.recognitionSinging(
            this.user.username || ''
          );
          this.user = data['data'];
          this.user.picture_url =
            'https://proyecto2-39-semi1.s3.us-east-2.amazonaws.com/';
          localStorage.setItem('user', JSON.stringify(this.user));
        } catch (error: any) {
          if (error['error']['data']['name'] === 'NotAuthorizedException')
            this.showSnackbar('Incorrect password.');
        }
      } else {
        this.showSnackbar('Password required :c');
      }
    });
  }

  cancel() {
    this.editing = false;
    this.user.profile_picture = this.prev_picture;
    this.user.picture_url =
      'https://proyecto2-39-semi1.s3.us-east-2.amazonaws.com/';
  }
  openDialogCamera() {
    //TODO Menu
    const dialogRef = this.dialog.open(CameraDialogComponent, {
      data: {
        image: '',
        url: '',
      },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        this.new_picture = result.imageAsBase64;
        this.user_updated.profile_picture = result.imageAsDataUrl;
        this.user.picture_url = '';
      }
    });
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
            this.user_updated.profile_picture = reader.result as string;
            this.user.picture_url = '';
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
      this.new_picture = base64.split(',')[1];
    };
    reader.readAsDataURL(photo);
  }

  showSnackbar(message: string) {
    this._snackBar.open(message, 'CLOSE', { duration: 3000 });
  }
}

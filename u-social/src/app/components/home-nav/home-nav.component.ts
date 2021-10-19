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
    public fb: FormBuilder
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

  ngOnInit() {
    const container = localStorage.getItem('user');
    if (container !== null) this.user = <UserModel>JSON.parse(container);
    this.user.name = 'María Reneé';
    this.user.username = 'manegra2.0';
    this.user.friends = 20;
    this.user.publications = 25;
    this.user.profile_picture =
      'https://proyecto2-39-semi1.s3.us-east-2.amazonaws.com/profile/stefanyc2854d51e-7fc1-459e-8227-b85c3e94b5f1undefined';
    this.user.bot_mode = true;
    this.user_updated = this.user;
    this.prev_picture = this.user.profile_picture;
  }

  logOut() {
    localStorage.clear();
    this._router.navigate(['/login']);
  }

  updateUser() {
    console.log(this.user_updated);
    const dialogRef = this.dialog.open(PasswordDialogComponent, {});

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        const md5 = new Md5();
        this.user.password = '' + md5.appendStr(result).end();
        if (true) {
          //TODO service for update user photo (new_picture base 64)
          console.log(this.user.password);
          this.editing = false;
          this.user = this.user_updated;
          this.prev_picture = this.user.profile_picture;
          localStorage.setItem('user', JSON.stringify(this.user));
        } else {
          this.showSnackbar('Incorrect password :c');
        }
      } else {
        this.showSnackbar('Password required :c');
      }
    });
  }

  cancel() {
    this.editing = false;
    this.user.profile_picture = this.prev_picture;
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

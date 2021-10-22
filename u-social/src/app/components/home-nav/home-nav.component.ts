import { Component } from '@angular/core';

import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

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
  public new_picture64: string;

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
    this.new_picture64 = '';
    this.myForm = this.fb.group({
      img: [null],
    });
  }

  async ngOnInit(): Promise<void> {
    const container = localStorage.getItem('user');
    if (container !== null) this.user = <UserModel>JSON.parse(container);
    this.getCounters();
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

  public edit() {
    this.editing = true;
    this.user_updated = new UserModel();
    this.user_updated.username = this.user.username;
    this.user_updated.profile_picture =
      'https://proyecto2-39-semi1.s3.us-east-2.amazonaws.com/' +
      this.user.profile_picture;
    this.user_updated.name = this.user.name;
    this.user_updated.bot_mode = this.user.bot_mode;
  }

  public cancel() {
    this.editing = false;
    this.new_picture64 = '';
    this.user_updated.profile_picture =
      'https://proyecto2-39-semi1.s3.us-east-2.amazonaws.com/' +
      this.user.profile_picture;
  }

  public updateUser() {
    const dialogRef = this.dialog.open(PasswordDialogComponent, {});

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        try {
          this.user_updated.password = result;
          const update = await this._userService.update(
            this.user_updated,
            this.user.profile_picture,
            this.new_picture64
          );

          if (update['code'] === '200') {
            this.editing = false;
            const data = await this._userService.recognitionSinging(
              this.user.username || ''
            );
            this.user = data['data'];
            localStorage.setItem('user', JSON.stringify(this.user));
            this.getCounters();
            this.showSnackbar('Updated succesfully c:');
          }
        } catch (error: any) {
          if (error['error']['data']['name'] === 'NotAuthorizedException')
            this.showSnackbar('Incorrect password.');
        }
      } else {
        this.showSnackbar('Password required :c');
      }
    });
  }

  openDialogCamera() {
    const dialogRef = this.dialog.open(CameraDialogComponent, {
      data: {
        image: '',
        url: '',
      },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        this.new_picture64 = result.imageAsBase64;
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
      this.new_picture64 = base64.split(',')[1];
    };
    reader.readAsDataURL(photo);
  }

  showSnackbar(message: string) {
    this._snackBar.open(message, 'CLOSE', { duration: 3000 });
  }
}

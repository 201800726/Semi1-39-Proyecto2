import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-password-dialog',
  templateUrl: './password-dialog.component.html',
  styleUrls: ['./password-dialog.component.css'],
})
export class PasswordDialogComponent implements OnInit {
  public password: string | undefined;
  constructor(public dialogRef: MatDialogRef<PasswordDialogComponent>) {
    this.password = undefined;
  }

  ngOnInit(): void {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}

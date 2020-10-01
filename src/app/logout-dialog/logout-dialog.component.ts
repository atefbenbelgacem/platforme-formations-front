import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { User } from '../interfaces/user';
import { ColorSchemeService } from '../shared/color-schema.service';

@Component({
  selector: 'app-logout-dialog',
  templateUrl: './logout-dialog.component.html',
  styleUrls: ['./logout-dialog.component.css']
})
export class LogoutDialogComponent implements OnInit {
  user: User
  isChecked: boolean;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: User,
    public dialogRef: MatDialogRef<LogoutDialogComponent>,
    private colorSchemeService: ColorSchemeService
  ) {
    this.user = data
    if (colorSchemeService.currentActive() === 'dark') {
      this.isChecked = true
    }else {
      this.isChecked = false
    }
  }

  ngOnInit(): void {
  }

  changeTheme(event: any) {
    if (event === true) {
      this.colorSchemeService.update('dark')
    }else{
      this.colorSchemeService.update('light')
    }
  }

  doAction(action: string) {
    this.dialogRef.close({ action: action })
  }

}

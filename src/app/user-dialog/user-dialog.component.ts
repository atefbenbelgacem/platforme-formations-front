import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from '../interfaces/user';

@Component({
  selector: 'app-user-dialog',
  templateUrl: './user-dialog.component.html',
  styleUrls: ['./user-dialog.component.css']
})
export class UserDialogComponent implements OnInit {
  user: User

  constructor(@Inject(MAT_DIALOG_DATA) public data: User) {
    this.user = data
  }

  ngOnInit(): void {
  }

}

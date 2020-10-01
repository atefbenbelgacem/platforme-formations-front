import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { debounceTime, tap, switchMap, finalize } from 'rxjs/operators';
import { User } from '../interfaces/user';
import { UsersService } from '../services/users.service';

@Component({
  selector: 'app-user-search',
  templateUrl: './user-search.component.html',
  styleUrls: ['./user-search.component.css']
})
export class UserSearchComponent implements OnInit {

  actionForm: FormGroup;
  isLoading: boolean;
  filteredUsers: User[] = [];

  constructor(
    public dialogRef: MatDialogRef<UserSearchComponent>,
    private formBuilder: FormBuilder,
    private readonly userService: UsersService
  ) { }

  ngOnInit(): void {
    this.actionForm = this.formBuilder.group({
      user: new FormControl('', Validators.required)
    })

    this.actionForm
      .get('user')
      .valueChanges
      .pipe(
        debounceTime(500),
        tap(() => this.isLoading = true),
        switchMap(value => this.userService.elasticSearch(value, 1)
          .pipe(
            finalize(() => this.isLoading = false),
          )
        )
      )
      .subscribe(users => this.filteredUsers = users);
  }

  onSubmit() {
    if (this.actionForm.invalid) {
      return;
    }
    const userEmail = this.actionForm.value.user
    this.dialogRef.close({event: "Add", data: userEmail });
  }

  closeDialog() {
    this.dialogRef.close({ event: "Cancel" });
  }
}

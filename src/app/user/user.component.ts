import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { User } from '../interfaces/user';
import { UsersService } from '../services/users.service';
import { SnackBarService } from '../shared/snack-bar.service';
import { UserEditDialogComponent } from '../user-edit-dialog/user-edit-dialog.component';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent implements OnInit {
  actionLoading: boolean = false;
  currentUser: User;
  emailsList: string[] = [];
  displayedColumns: string[] = [
    'index',
    'name',
    'lastName',
    'email',
    'pole',
    'roleName',
    'action',
  ];
  dataSource: MatTableDataSource<User>;

  @ViewChild('usersTable', {
    static: false,
  })
  table: MatTable<User>;
  @ViewChild(MatPaginator, {
    static: true,
  })
  paginator: MatPaginator;
  @ViewChild(MatSort, {
    static: true,
  })
  sort: MatSort;

  constructor(
    public dialog: MatDialog,
    private readonly snackService: SnackBarService,
    private readonly userService: UsersService
  ) {
    this.currentUser = JSON.parse(sessionStorage.getItem('currentUser')).user;
  }

  ngOnInit(): void {
    this._getAllUsers();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openDialog(action: string, user: any) {
    user.action = action;
    user.emailsList = this.emailsList;

    const dialogRef = this.dialog.open(UserEditDialogComponent, {
      width: '500px',
      data: user,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (result.event == 'Add') {
          this.addRowData(result.data);
        } else if (result.event == 'Update') {
          this.updateRowData(result.data);
        }
      }
    });
  }

  addRowData(data: User) {
    this.actionLoading = true;
    this.userService.add(data).subscribe((user) => {
      this._getAllUsers();
      this.snackService.openSnackBar('User Added Successfully');
    });
  }

  updateRowData(data: User) {
    this.actionLoading = true;
    this.userService.update(data._id, data).subscribe((user) => {
      this._getAllUsers();
      this.snackService.openSnackBar('User Updated Successfully');
    });
  }

  deleteRowData(user: User) {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '350px',
      data: user,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.event == 'Ok') {
        this.actionLoading = true;
        this.userService.delete(user._id).subscribe((res) => {
          this._getAllUsers();
          this.snackService.openSnackBar('User Deleted Successfully');
        });
      }
    });
  }

  private _getAllUsers() {
    this.actionLoading = true;
    this.userService.getAll().subscribe(
      (users) => {
        this.dataSource = new MatTableDataSource(users);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        users.map((user) => {
          this.emailsList.push(user.email);
        });
        this.actionLoading = false;
      },
      (error) => {
        this.actionLoading = false;
        console.log(error);
        this.snackService.openSnackBar('error getting users');
      }
    );
  }
}

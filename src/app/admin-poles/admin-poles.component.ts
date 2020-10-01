import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { Pole } from '../interfaces/pole';
import { User } from '../interfaces/user';
import { PolesDialogComponent } from '../poles-dialog/poles-dialog.component';
import { PoleService } from '../services/pole.service';
import { SnackBarService } from '../shared/snack-bar.service';

@Component({
  selector: 'app-admin-poles',
  templateUrl: './admin-poles.component.html',
  styleUrls: ['./admin-poles.component.css'],
})
export class AdminPolesComponent implements OnInit {
  actionLoading: boolean = false;
  displayedColumns: string[] = ['index', 'name', 'action'];
  dataSource: MatTableDataSource<Pole>;

  @ViewChild('polesTable', {
    static: false,
  })
  table: MatTable<Pole>;
  @ViewChild(MatPaginator, {
    static: true,
  })
  paginator: MatPaginator;
  @ViewChild(MatSort, {
    static: true,
  })
  sort: MatSort;

  constructor(
    private readonly dialog: MatDialog,
    private readonly snackService: SnackBarService,
    private readonly poleService: PoleService
  ) {}

  ngOnInit(): void {
    this._getAllPoles();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openDialog(action: string, pole: any) {
    pole.action = action;

    const dialogRef = this.dialog.open(PolesDialogComponent, {
      width: '400px',
      data: pole,
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

  addRowData(data: Pole) {
    this.actionLoading = true;
    this.poleService.add(data).subscribe((res) => {
      this._getAllPoles();
      this.snackService.openSnackBar('Pole Added Successfully');
    });
  }

  updateRowData(data: Pole) {
    this.actionLoading = true;
    this.poleService.update(data._id, data).subscribe((res) => {
      this._getAllPoles();
      this.snackService.openSnackBar('Pole Updated Successfully');
    });
  }

  deleteRowData(pole: Pole) {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '350px',
      data: pole,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.event == 'Ok') {
        this.actionLoading = true;
        this.poleService.delete(pole._id).subscribe((res) => {
          this._getAllPoles();
          this.snackService.openSnackBar('Pole Deleted Successfully');
        });
      }
    });
  }

  private _getAllPoles() {
    this.actionLoading = true;
    this.poleService.getAllPoles().subscribe(
      (poles) => {
        this.dataSource = new MatTableDataSource(poles);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.actionLoading = false;
      },
      (error) => {
        this.actionLoading = false;
        console.log(error);
        this.snackService.openSnackBar('error getting poles');
      }
    );
  }
}

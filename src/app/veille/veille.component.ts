import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { User } from '../interfaces/user';
import { VeilleEvent } from '../interfaces/veille-event';
import { VeilleEventService } from '../services/veille-event.service';
import { SnackBarService } from '../shared/snack-bar.service';
import { UserDialogComponent } from '../user-dialog/user-dialog.component';

@Component({
  selector: 'app-veille',
  templateUrl: './veille.component.html',
  styleUrls: ['./veille.component.css'],
})
export class VeilleComponent implements OnInit {
  actionLoading: boolean = false;
  veilles: VeilleEvent[];
  currentUser: User;
  filteredVeilles: VeilleEvent[];

  constructor(
    private readonly veilleService: VeilleEventService,
    public dialog: MatDialog,
    private readonly snackService: SnackBarService
  ) {
    this.currentUser = JSON.parse(sessionStorage.getItem('currentUser')).user;
  }

  ngOnInit(): void {
    this._getAllVeilles();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filteredVeilles = this.veilles.filter((veille) => {
      return veille.title
        .trim()
        .toLowerCase()
        .includes(filterValue.trim().toLowerCase());
    });
  }

  openPersonDialog(person: User) {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '350px',
      data: person,
    });
  }

  private _getAllVeilles() {
    this.actionLoading = true;
    this.veilleService.getVeilleByPole(this.currentUser.pole._id).subscribe(
      (data) => {
        this.actionLoading = false;
        console.log(data);
        this.veilles = data;
        this.filteredVeilles = this.veilles;
      },
      (error) => {
        this.actionLoading = false;
        this.snackService.openSnackBar('an error has occured');
      }
    );
  }
}

import { Component, OnInit } from '@angular/core';
import { VeilleEventService } from '../services/veille-event.service';
import { VeilleEvent } from '../interfaces/veille-event';
import { MatDialog } from '@angular/material/dialog';
import { UsersService } from '../services/users.service';
import { SnackBarService } from '../shared/snack-bar.service';
import { VeilleEventDialogComponent } from '../veille-event-dialog/veille-event-dialog.component';
import { User } from '../interfaces/user';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { UserDialogComponent } from '../user-dialog/user-dialog.component';

@Component({
  selector: 'app-admin-veille',
  templateUrl: './admin-veille.component.html',
  styleUrls: ['./admin-veille.component.css']
})
export class AdminVeilleComponent implements OnInit {

  actionLoading: boolean = false
  veilles: VeilleEvent[]
  filteredVeilles: VeilleEvent[];

  constructor(
    private readonly veilleService: VeilleEventService,
    public dialog: MatDialog,
    private readonly userService: UsersService,
    private readonly snackService: SnackBarService
  ) { }

  ngOnInit(): void {
    this._getAllVeilles()
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filteredVeilles = this.veilles.filter(veille=>{
      return veille.title.trim().toLowerCase().includes(filterValue.trim().toLowerCase())
    })
  }

  openActionDialog(action: string, veille: any) {
    veille.action = action;
    // console.log(pizza)

    const dialogRef = this.dialog.open(VeilleEventDialogComponent, {
      width: "600px",
      data: veille
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.event == "Add") {
          this.addRowData(result.data);
        } else if (result.event == "Update") {
          this.updateRowData(result.data);
        }
      }
    });
  }

  addRowData(data: any) {
    let presenter: User
    const usersEmails = [data.presenter]
    this.actionLoading = true
    this.userService.getEmailsUsers(usersEmails).subscribe(users => {
      presenter = users[0]
      const newEvent: VeilleEvent = {
        title: data.title,
        description: data.description,
        date: data.date,
        duration: data.duration,
        pole: data.pole,
        presenter: presenter._id
      }
      console.log(newEvent)
      this.veilleService.addVeille(newEvent).subscribe(event => {
        this._getAllVeilles()
        this.snackService.openSnackBar('Event Added Successfully')
      })
    })
  }

  updateRowData(data: any) {
    let presenter: User
    const usersEmails = [data.presenter]
    this.actionLoading = true
    this.userService.getEmailsUsers(usersEmails).subscribe(users => {
      presenter = users[0]
      const updateEvent: VeilleEvent = {
        _id: data._id,
        title: data.title,
        description: data.description,
        date: data.date,
        duration: data.duration,
        pole: data.pole,
        presenter: presenter
      }
      console.log(updateEvent)
      this.veilleService.updateVeille(updateEvent._id, updateEvent).subscribe(event => {
        this._getAllVeilles()
        this.snackService.openSnackBar('Event Updated Successfully')
      })
    })
  }

  deleteRowData(veille: VeilleEvent) {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: "350px",
      data: veille
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.event == "Ok") {
        console.log(veille._id)
        this.actionLoading = true
        this.veilleService.deleteVeille(veille._id).subscribe(event => {
          this._getAllVeilles()
          this.snackService.openSnackBar('Event Deleted Successfully')
        })
      }
    })
  }

  openPersonDialog(person: User) {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: "350px",
      data: person
    });
  }

  private _getAllVeilles() {
    this.actionLoading = true
    this.veilleService.getAllVeilles().subscribe(data => {
      this.actionLoading = false
      console.log(data)
      this.veilles = data
      this.filteredVeilles = this.veilles
    }, error => {
      this.actionLoading = false
      console.log(error)
    })
  }

}

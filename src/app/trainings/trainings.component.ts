import { Component, OnInit } from '@angular/core';
import { TrainingsService } from '../services/trainings-service.service';
import { Training } from '../interfaces/training';
import { User } from '../interfaces/user';
import { UserDialogComponent } from '../user-dialog/user-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { TrainingDialogComponent } from '../training-dialog/training-dialog.component';
import { UsersService } from '../services/users.service';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { SnackBarService } from '../shared/snack-bar.service';

@Component({
  selector: 'app-admin-trainings',
  templateUrl: './trainings.component.html',
  styleUrls: ['./trainings.component.css']
})
export class TrainingsComponent implements OnInit {
  trainings: Training[]
  actionLoading = false
  filteredTrainings: Training[]
  constructor(
    private readonly trainingservice: TrainingsService,
    public dialog: MatDialog,
    private readonly userService: UsersService,
    private readonly snackService: SnackBarService
  ) {

  }

  ngOnInit(): void {
    this._getAllTrainings()
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filteredTrainings = this.trainings.filter(training=>{
      return training.title.trim().toLowerCase().includes(filterValue.trim().toLowerCase())
    })
  }

  openActionDialog(action: string, training: any) {
    training.action = action;
    console.log(training)

    const dialogRef = this.dialog.open(TrainingDialogComponent, {
      width: "500px",
      data: training
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
    let teacher: User
    const usersEmails = data.students.concat(data.teacher)
    this.actionLoading = true
    this.userService.getEmailsUsers(usersEmails).subscribe(users => {
      const index = users.findIndex(user => {
        return user.email === data.teacher
      })
      if (index > -1) {
        teacher = users.splice(index, 1).shift()
      }
      const newTraining: Training = {
        title: data.title,
        subject: data.subject,
        teacher: teacher._id,
        students: users
      }
      this.trainingservice.addTraining(newTraining).subscribe(result => {
        this._getAllTrainings()
        this.snackService.openSnackBar('Training Added Successfully')
      })
    })

  }

  updateRowData(data: any) {
    let teacher: User
    const usersEmails = data.students.concat(data.teacher)
    this.actionLoading = true
    this.userService.getEmailsUsers(usersEmails).subscribe(users => {
      const index = users.findIndex(user => {
        return user.email === data.teacher
      })
      if (index > -1) {
        teacher = users.splice(index, 1).shift()
      }
      const trainingUpdate: Training = {
        _id: data._id,
        title: data.title,
        subject: data.subject,
        teacher: teacher,
        students: users,
        sessions: data.sessions
      }
      this.trainingservice.updateTraining(trainingUpdate._id, trainingUpdate).subscribe(res => {
        this._getAllTrainings()
        this.snackService.openSnackBar('Training Updated Successfully')
      })

    })

  }

  deleteRowData(training: Training) {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: "350px",
      data: training
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.event == "Ok") {
        this.actionLoading = true
        this.trainingservice.deleteTraining(training._id).subscribe(data => {
          this._getAllTrainings()
          this.snackService.openSnackBar('Training Deleted Successfully')
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

  _getAllTrainings() {
    this.actionLoading = true
    this.trainingservice.getAllTrainings().subscribe(data => {
      this.actionLoading = false
      console.log(data)
      this.trainings = data
      this.filteredTrainings = this.trainings
    }, error => {
      this.actionLoading = false
      console.log(error)
    })
  }

}

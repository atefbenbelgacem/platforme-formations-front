import { Component, OnInit } from '@angular/core';
import { Training } from '../interfaces/training';
import { TrainingsService } from '../services/trainings-service.service';
import { MatDialog } from '@angular/material/dialog';
import { User } from '../interfaces/user';
import { UserDialogComponent } from '../user-dialog/user-dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-trainings',
  templateUrl: './user-trainings.component.html',
  styleUrls: ['./user-trainings.component.css']
})
export class UserTrainingsComponent implements OnInit {

  trainings: Training[]
  currentUser: any
  filteredTrainings: Training[];

  constructor(
    private readonly trainingservice: TrainingsService,
    public dialog: MatDialog,
    private router: Router,
  ) {
    this.currentUser = JSON.parse(sessionStorage.getItem('currentUser'))
  }

  ngOnInit(): void {
    if (this._isTeacher()) {
      this._getTeacherTrainings()
    } else {
      this._getStudentsTraining()
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filteredTrainings = this.trainings.filter(training=>{
      return training.title.trim().toLowerCase().includes(filterValue.trim().toLowerCase())
    })
  }


  openPersonDialog(person: User) {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: "350px",
      data: person
    });
  }

  _getTeacherTrainings() {
    this.trainingservice.getTeacherTrainings(this.currentUser.user._id).subscribe(data => {
      this.trainings = data
      this.filteredTrainings = this.trainings
    })
  }

  _getStudentsTraining() {
    this.trainingservice.getStudentTrainings(this.currentUser.user._id).subscribe(data => {
      this.trainings = data
      this.filteredTrainings = this.trainings
    })
  }

  _isTeacher(): boolean {
    return this.router.url === '/training/teacher'
  }

}

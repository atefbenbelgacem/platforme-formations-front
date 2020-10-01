import { Component, OnInit, ViewChild } from '@angular/core';
import { StateServiceData } from '../interfaces/state-data';
import { StateService } from '../shared/state.service';
import { SessionsService } from '../services/sessions.service';
import { QuestionsService } from '../services/questions.service';
import { Session } from '../interfaces/session';
import { Question } from '../interfaces/question';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { QuizzDialogComponent } from '../quizz-dialog/quizz-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { QuizzResultService } from '../services/quizz-result.service';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { SnackBarService } from '../shared/snack-bar.service';

@Component({
  selector: 'app-admin-quizz',
  templateUrl: './admin-quizz.component.html',
  styleUrls: ['./admin-quizz.component.css']
})
export class AdminQuizzComponent implements OnInit {

  isDisabled: boolean = false
  actionLoading = false;
  addedQuestions: string[] = []
  deletededQuestions: string[] = []
  routeData: StateServiceData
  currentSession: Session
  displayedColumns: string[] = ['index', 'question', 'action'];
  dataSource: MatTableDataSource<Question>;

  @ViewChild("quizzTable", { static: false }) table: MatTable<Question>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    public dialog: MatDialog,
    private stateService: StateService,
    private readonly sessionService: SessionsService,
    private readonly questionService: QuestionsService,
    private readonly quizzResultService: QuizzResultService,
    private router: Router,
    private readonly snackService: SnackBarService
  ) { }

  ngOnInit(): void {
    if (this.stateService.data && this.stateService.data.sessionId) {
      this.routeData = this.stateService.data
      this.stateService.data = undefined
      this.actionLoading = true
      this.sessionService.getSessionById(this.routeData.sessionId).subscribe(data => {
        // console.log(data);
        this.currentSession = data
        this.dataSource = new MatTableDataSource(this.currentSession.quizz)
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.quizzResultService.getSessionResults(this.routeData.sessionId).subscribe(results => {
          if (results && results.length !== 0) {
            this.isDisabled = true
          }
          this.actionLoading = false
        })
      });
    } else {
      this.router.navigate(['/training'])
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openDialog(action: string, question: any) {
    question.action = action;
    // console.log(question)

    const dialogRef = this.dialog.open(QuizzDialogComponent, {
      width: "500px",
      data: question
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

  deleteRowData(question: Question) {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: "350px",
      data: question
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.event == "Ok") {
        this.actionLoading = true
        this.questionService.deleteQuestion(question._id).subscribe(deletedQuestion => {
          this.actionLoading = false
          const data = this.dataSource.data;
          const index = data.findIndex(question => {
            return question._id === deletedQuestion._id
          })
          if (index > -1) {
            data.splice(index, 1)
            this.dataSource.data = data;
            this.table.renderRows();
            const idIndex = this.addedQuestions.indexOf(deletedQuestion._id)
            if (idIndex > -1) {
              this.addedQuestions.splice(idIndex, 1)
            } else {
              this.deletededQuestions.push(deletedQuestion._id)
            }
          }
          this.snackService.openSnackBar('Question Deleted Successfully')
        })
      }
    })
  }
  updateRowData(data: Question) {
    // console.log(data)
    this.actionLoading = true
    this.questionService.updateQuestion(data._id, data).subscribe(updatedQuestion => {
      this.actionLoading = false
      // console.log(updatedQuestion)
      const data = this.dataSource.data;
      const index = data.findIndex(question => {
        return question._id === updatedQuestion._id
      })
      if (index > -1) {
        data.splice(index, 1, updatedQuestion)
        this.dataSource.data = data;
        this.table.renderRows();
      }
      this.snackService.openSnackBar('Question Updated Successfully')
    })
  }
  addRowData(data: Question) {
    this.actionLoading = true
    this.questionService.addQuestion(data).subscribe(newQuestion => {
      this.actionLoading = false
      const data = this.dataSource.data;
      data.push(newQuestion);
      this.dataSource.data = data;
      this.table.renderRows();
      this.addedQuestions.push(newQuestion._id)
      this.snackService.openSnackBar('Question Added Successfully')
    })

  }

  doneQuizz() {
    if (this.addedQuestions.length !== 0 && this.deletededQuestions.length !== 0) {
      this.actionLoading = true
      this.sessionService.addQuestions(this.routeData.sessionId, this.routeData.trainingId, this.addedQuestions).subscribe(result => {
        // console.log(result)
        this.sessionService.deleteQuestions(this.routeData.sessionId, this.routeData.trainingId, this.deletededQuestions).subscribe(session => {
          this.actionLoading = false
          // console.log(session)
          this.router.navigate(['/training'])
        })
      })
    } else if (this.addedQuestions.length !== 0 && this.deletededQuestions.length === 0) {
      this.actionLoading = true
      this.sessionService.addQuestions(this.routeData.sessionId, this.routeData.trainingId, this.addedQuestions).subscribe(result => {
        this.actionLoading = false
        // console.log(result)
        this.router.navigate(['/training'])
      })
    } else if (this.addedQuestions.length === 0 && this.deletededQuestions.length !== 0) {
      this.actionLoading = true
      this.sessionService.deleteQuestions(this.routeData.sessionId, this.routeData.trainingId, this.deletededQuestions).subscribe(session => {
        this.actionLoading = false
        // console.log(session)
        this.router.navigate(['/training'])
      })
    } else {
      console.log('nothing did happened')
      this.router.navigate(['/training'])
    }

  }

}

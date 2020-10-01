import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Session } from '../interfaces/session';
import { MatTable } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { SessionDialogComponent } from '../session-dialog/session-dialog.component';
import { SessionsService } from '../services/sessions.service';
import { MatSelectionList } from '@angular/material/list';
import { StateService } from '../shared/state.service';
import { Router } from '@angular/router';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { SnackBarService } from '../shared/snack-bar.service';

@Component({
  selector: 'app-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.css'],
  animations: [
    trigger("detailExpand", [
      state("collapsed", style({ height: "0px", minHeight: "0" })),
      state("expanded", style({ height: "*" })),
      transition(
        "expanded <=> collapsed",
        animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)")
      )
    ])
  ]
})
export class SessionComponent implements OnInit {
  @Input() trainingId: string;
  @Input() sessions: Session[];
  @ViewChild("fileInput", { static: false }) fileInput: ElementRef;
  @ViewChild("myTable", { static: false }) table: MatTable<any>;
  @ViewChild("selectedFiles") selectedFiles: MatSelectionList;

  sessionsDataSource: Session[];
  columnsToDisplay: string[];
  expandedElement: Session | null;

  listSelectionData: any[];
  fileSelected: any;


  constructor(
    public dialog: MatDialog,
    private readonly sessionService: SessionsService,
    private stateService: StateService,
    private router: Router,
    private readonly snackService: SnackBarService
  ) { }

  ngOnInit(): void {
    this.sessionsDataSource = this.sessions;
    this.columnsToDisplay = ["title", "duration", "date"];
  }

  onFileComplete(data: any, sessionId: string) {
    const document = {
      docTitle: data.fileName,
      link: data.event.link
    }
    this.sessionService.uploadFile(sessionId, this.trainingId, document).subscribe(data => {
      //console.log(data);
      this._updateTable(data)
      this.snackService.openSnackBar('File Uploaded Successfully')
    });

  }

  deleteFiles(documents: any, session: any) {
    let documentsToDelete = []
    if (this.selectedFiles.selectedOptions.selected && this.selectedFiles.selectedOptions.selected.length != 0) {
      const dialogRef = this.dialog.open(DeleteDialogComponent, {
        width: "350px"
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result && result.event == "Ok") {
          this.selectedFiles.selectedOptions.selected.map(option => {
            const index = documents.findIndex((doc: any) => {
              return doc.link === option.value.link;
            });
            if (index > -1) {
              documentsToDelete.push(documents[index])
            }
          });
          this.sessionService.deleteFiles(session._id, this.trainingId, documentsToDelete).subscribe(data => {
            this._updateTable(data)
            this.snackService.openSnackBar('Files Deleted Successfully')
          });
        }
      })
    } else {
      this.snackService.openSnackBar('You Must Select Files First')
    }
  }

  openDialog(action: string, session: any) {
    session.action = action;
    //console.log(session)

    const dialogRef = this.dialog.open(SessionDialogComponent, {
      width: "500px",
      data: session
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.event == "Add") {
          this.addRowData(result.data);
        } else if (result.event == "Update") {
          this.updateRowData(result.data);
        } else if (result.event == "Delete") {
          this.deleteRowData(result.data.sessionId);
        }
      }
    });
  }

  addRowData(data: any) {
    const newSession = {
      title: data.title,
      duration: data.duration,
      date: new Date(data.date),
      documents: [],
      quizz: []
    };

    this.sessionService.addSession(newSession, this.trainingId).subscribe(data => {
      this.sessionsDataSource.push(data)
      this.table.renderRows();
      this.snackService.openSnackBar('Session Added Successfully')
    });
  }

  updateRowData(data: any) {
    this.sessionService.updateSession(data._id, this.trainingId, data).subscribe(data => {
      //console.log(data)
      this._updateTable(data)
      this.snackService.openSnackBar('Session Updated Successfully')
    })
  }

  deleteRowData(session: Session) {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: "350px",
      data: session
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.event == "Ok") {
        this.sessionService.deleteSession(session._id, this.trainingId).subscribe(data => {
          const index = this.sessionsDataSource.findIndex(ses => {
            return ses._id === data._id
          })
          if (index > -1) {
            this.sessionsDataSource.splice(index, 1)
            this.table.renderRows();
            this.snackService.openSnackBar('Session Deleted Successfully')
          }
        });
      }
    })
  }

  goToQuizz(sessionId: string) {
    this.stateService.data = { sessionId: sessionId, trainingId: this.trainingId }
    // this.stateService.data.sessionId = sessionId
    // this.stateService.data.trainingId = this.trainingId
    this.router.navigate(['/admin/quizz']);
  }

  private _updateTable(session: Session) {
    const index = this.sessionsDataSource.findIndex(ses => {
      return ses._id === session._id
    })
    if (index > -1) {
      this.sessionsDataSource.splice(index, 1, session)
      this.table.renderRows();
    }
  }

}

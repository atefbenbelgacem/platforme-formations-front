import { Component, OnInit, Input } from '@angular/core';
import { Session } from '../interfaces/session';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Router } from '@angular/router';
import { StateService } from '../shared/state.service';
import { User } from '../interfaces/user';
import { QuizzResultService } from '../services/quizz-result.service';

@Component({
  selector: 'app-student-session',
  templateUrl: './student-session.component.html',
  styleUrls: ['./student-session.component.css'],
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
export class StudentSessionComponent implements OnInit {

  @Input() trainingId: string;
  @Input() sessions: Session[];

  sessionsDataSource: Session[];
  columnsToDisplay: string[];
  expandedElement: Session | null;
  currentUser: User;
  quizzSessionsIds: string[] = []


  constructor(
    private router: Router,
    private stateService: StateService,
    private readonly quizzResultService: QuizzResultService
  ) {
    this.currentUser = JSON.parse(sessionStorage.getItem('currentUser')).user
    this.quizzResultService.getAllUserResults(this.currentUser._id).subscribe(data => {
      console.log(data)
      if (data) {
        data.map(quizResult => {
          this.quizzSessionsIds.push(quizResult.session._id)
        })
      }
    })
  }

  ngOnInit(): void {
    this.sessionsDataSource = this.sessions;
    this.columnsToDisplay = ["title", "duration", "date"];
  }

  goToQuiz(sessionId: string) {
    this.stateService.data = { sessionId: sessionId, trainingId: this.trainingId }
    this.router.navigate(['/quizz'])
  }

}

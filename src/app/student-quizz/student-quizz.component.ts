import { Component, OnInit } from '@angular/core';
import { Session } from '../interfaces/session';
import { StateService } from '../shared/state.service';
import { SessionsService } from '../services/sessions.service';
import { StateServiceData } from '../interfaces/state-data';
import { Router } from '@angular/router';
import { Question } from '../interfaces/question';
import { QuizzResult } from '../interfaces/quizz-result';
import { QuestionAnswer } from '../interfaces/question-answer';
import { QuizzResultService } from '../services/quizz-result.service';

@Component({
  selector: 'app-student-quizz',
  templateUrl: './student-quizz.component.html',
  styleUrls: ['./student-quizz.component.css']
})
export class StudentQuizzComponent implements OnInit {

  actionLoading = false;
  currentSession: Session
  routeData: StateServiceData
  introLayout: boolean = true
  currentUser: any;
  quizz: Question[];
  quizzResult: QuizzResult
  quizzAnswers: QuestionAnswer[] = []
  currentQuestionAnswers: string[] = []

  totalDuration: number = 120 //must be in seconds
  duration: string = "";
  timer: any = null;
  startTime: Date;
  ellapsedTime = "00:00";
  pager = {
    index: 0,
    size: 1,
    count: 1
  };

  constructor(
    private stateService: StateService,
    private readonly sessionService: SessionsService,
    private readonly quizzResultService: QuizzResultService,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (this.stateService.data && this.stateService.data.sessionId) {
      this.routeData = this.stateService.data
      this.stateService.data = undefined
      this.actionLoading = true
      this.sessionService.getSessionById(this.routeData.sessionId).subscribe(data => {
        // console.log(data);
        this.actionLoading = false
        this.currentSession = data
        this.currentUser = JSON.parse(sessionStorage.getItem('currentUser')).user
      })
    } else {
      this.router.navigate(['/training/student'])
    }
  }
  startQuiz() {
    console.log(this.currentUser, '--------->>', this.currentSession)
    this.quizz = this.currentSession.quizz
    this.pager.count = this.quizz.length;
    this.duration = this.parseTime(this.totalDuration);
    this.startTime = new Date();
    this.timer = setInterval(() => {
      this.tick();
    }, 1000);
    this.introLayout = false
  }
  tick() {
    const now = new Date();
    const diff = (now.getTime() - this.startTime.getTime()) / 1000;
    if (diff >= this.totalDuration) {
      this.onSubmit();
    }
    this.ellapsedTime = this.parseTime(diff);
  }
  parseTime(seconds: number): string {
    let mins: string | number = Math.floor(seconds / 60);
    let secs: string | number = Math.round(seconds % 60);
    mins = (mins < 10 ? "0" : "") + mins;
    secs = (secs < 10 ? "0" : "") + secs;
    return `${mins}:${secs}`;
  }

  get filteredQuestions() {
    return this.quizz ?
      this.quizz.slice(this.pager.index, this.pager.index + this.pager.size)
      : [];
  }

  next(index: number) {
    if (index >= 0 && index < this.pager.count) {
      const currentQuestion = this.filteredQuestions[0]
      this.quizzAnswers.push({
        question: currentQuestion._id,
        answers: this.currentQuestionAnswers
      })
      this.currentQuestionAnswers = []
      this.pager.index = index;
    }
  }

  onSelect(event: any, value: string) {
    if (event === true) {
      this.currentQuestionAnswers.push(value)
    } else {
      const index = this.currentQuestionAnswers.indexOf(value)
      if (index > -1) {
        this.currentQuestionAnswers.splice(index, 1)
      }
    }
  }

  onSubmit() {
    clearInterval(this.timer)
    const currentQuestion = this.filteredQuestions[0]
    this.quizzAnswers.push({
      question: currentQuestion._id,
      answers: this.currentQuestionAnswers
    })
    this.currentQuestionAnswers = []
    this.quizzResult = {
      user: this.currentUser._id,
      session: this.currentSession._id,
      quizzAnswers: this.quizzAnswers,
      score: 0
    }
    this.quizzAnswers = []
    console.log(this.quizzResult)
    this.actionLoading = true
    this.quizzResultService.addResult(this.quizzResult).subscribe(data => {
      this.actionLoading = false
      console.log(data)
      this.pager = {
        index: 0,
        size: 1,
        count: 1
      };
      this.stateService.data = this.routeData
      this.router.navigate(['/quizz/result'])
    })
  }

}

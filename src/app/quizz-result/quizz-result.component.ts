import { Component, OnInit } from '@angular/core';
import { StateService } from '../shared/state.service';
import { QuizzResultService } from '../services/quizz-result.service';
import { Router } from '@angular/router';
import { StateServiceData } from '../interfaces/state-data';
import { User } from '../interfaces/user';
import { QuizzResult } from '../interfaces/quizz-result';

@Component({
  selector: 'app-quizz-result',
  templateUrl: './quizz-result.component.html',
  styleUrls: ['./quizz-result.component.css']
})
export class QuizzResultComponent implements OnInit {

  dataLoading: boolean = false;
  displayLayout: boolean = false
  routeData: StateServiceData
  currentUser: User;
  currentResult: QuizzResult

  constructor(
    private stateService: StateService,
    private readonly quizzResultService: QuizzResultService,
    private router: Router
  ) {
    this.currentUser = JSON.parse(sessionStorage.getItem('currentUser')).user
  }

  ngOnInit(): void {

    if (this.stateService.data && this.stateService.data.sessionId) {
      this.routeData = this.stateService.data
      this.stateService.data = undefined
      this.dataLoading = true
      this.quizzResultService.getUserResult(this.currentUser._id, this.routeData.sessionId).subscribe(data => {
        this.dataLoading = false
        console.log(data)
        this.currentResult = data
        this.displayLayout = true
      })
    } else {
      this.router.navigate(['/training/student'])
    }
  }

  get getRecommendation() {
    const percentage = (this.currentResult.score / this.currentResult.session.quizz.length) * 100
    if (percentage === 100) {
      return 1
    } else if (percentage > 50) {
      return 2
    } else {
      return 3
    }
  }

  back() {
    this.router.navigate(['/training/student'])
  }

}

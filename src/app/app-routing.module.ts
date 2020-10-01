import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { NoAuthGuard } from './guards/no-auth.guard';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { SharedNavComponent } from './shared-nav/shared-nav.component';
import { TrainingsComponent } from './trainings/trainings.component';
import { UserTrainingsComponent } from './user-trainings/user-trainings.component';
import { AdminQuizzComponent } from './admin-quizz/admin-quizz.component';
import { StudentQuizzComponent } from './student-quizz/student-quizz.component';
import { QuizzResultComponent } from './quizz-result/quizz-result.component';
import { AdminPizzaUComponent } from './admin-pizza-u/admin-pizza-u.component';
import { AdminVeilleComponent } from './admin-veille/admin-veille.component';
import { PizzaUComponent } from './pizza-u/pizza-u.component';
import { VeilleComponent } from './veille/veille.component';
import { UserComponent } from './user/user.component';


const routes: Routes = [
  {
    path: '',
    component: SharedNavComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'training',
        component: TrainingsComponent,
        canActivate: [AuthGuard, AdminGuard]
      },
      {
        path: 'training/teacher',
        component: UserTrainingsComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'training/student',
        component: UserTrainingsComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'pizza-U',
        component: AdminPizzaUComponent,
        canActivate: [AuthGuard, AdminGuard]
      },
      {
        path: 'Tech-Watch',
        component: AdminVeilleComponent,
        canActivate: [AuthGuard, AdminGuard]
      },
      {
        path: 'pizza-U/student',
        component: PizzaUComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'Tech-Watch/student',
        component: VeilleComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'admin/quizz',
        component: AdminQuizzComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'users',
        component: UserComponent,
        canActivate: [AuthGuard, AdminGuard]
      },
    ]
  },
  {
    path: 'auth',
    component: AuthComponent,
    canActivate: [NoAuthGuard]
  },
  {
    path: 'quizz',
    component: StudentQuizzComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'quizz/result',
    component: QuizzResultComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

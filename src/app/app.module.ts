import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RootMaterialModule } from './material-module';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthComponent } from './auth/auth.component';
import { SharedNavComponent } from './shared-nav/shared-nav.component';
import { LogoutDialogComponent } from './logout-dialog/logout-dialog.component';
import { EventEmitterService } from './shared/event-emitter.service';
import { TrainingsComponent } from './trainings/trainings.component';
import { JwtInterceptor } from './interceptors/jwt-interceptor.interceptor';
import { UserDialogComponent } from './user-dialog/user-dialog.component';
import { SessionComponent } from './session/session.component';
import { SessionDialogComponent } from './session-dialog/session-dialog.component';
import { FilesUploadComponent } from './files-upload/files-upload.component';
import { TrainingDialogComponent } from './training-dialog/training-dialog.component';
import { UserTrainingsComponent } from './user-trainings/user-trainings.component';
import { StudentSessionComponent } from './student-session/student-session.component';
import { AdminQuizzComponent } from './admin-quizz/admin-quizz.component';
import { QuizzDialogComponent } from './quizz-dialog/quizz-dialog.component';
import { StudentQuizzComponent } from './student-quizz/student-quizz.component';
import { QuizzResultComponent } from './quizz-result/quizz-result.component';
import { AdminPizzaUComponent } from './admin-pizza-u/admin-pizza-u.component';
import { PizzaEventDialogComponent } from './pizza-event-dialog/pizza-event-dialog.component';
import { UserSearchComponent } from './user-search/user-search.component';
import { DeleteDialogComponent } from './delete-dialog/delete-dialog.component';
import { AdminVeilleComponent } from './admin-veille/admin-veille.component';
import { VeilleEventDialogComponent } from './veille-event-dialog/veille-event-dialog.component';
import { PizzaUComponent } from './pizza-u/pizza-u.component';
import { VeilleComponent } from './veille/veille.component';
import { UserComponent } from './user/user.component';
import { UserEditDialogComponent } from './user-edit-dialog/user-edit-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    SharedNavComponent,
    LogoutDialogComponent,
    TrainingsComponent,
    UserDialogComponent,
    SessionComponent,
    SessionDialogComponent,
    FilesUploadComponent,
    TrainingDialogComponent,
    UserTrainingsComponent,
    StudentSessionComponent,
    AdminQuizzComponent,
    QuizzDialogComponent,
    StudentQuizzComponent,
    QuizzResultComponent,
    AdminPizzaUComponent,
    PizzaEventDialogComponent,
    UserSearchComponent,
    DeleteDialogComponent,
    AdminVeilleComponent,
    VeilleEventDialogComponent,
    PizzaUComponent,
    VeilleComponent,
    UserComponent,
    UserEditDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RootMaterialModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule
  ],
  providers: [EventEmitterService, {
    provide: HTTP_INTERCEPTORS,
    useClass: JwtInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }

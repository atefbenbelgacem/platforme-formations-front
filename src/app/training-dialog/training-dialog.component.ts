import { Component, Inject, Optional, OnInit, ElementRef, ViewChild } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { MatChipInputEvent } from "@angular/material/chips";
import { debounceTime, tap, switchMap, finalize } from "rxjs/operators";
import { User } from '../interfaces/user';
import { UsersService } from '../services/users.service';

@Component({
  selector: 'app-training-dialog',
  templateUrl: './training-dialog.component.html',
  styleUrls: ['./training-dialog.component.css']
})
export class TrainingDialogComponent implements OnInit {
  @ViewChild("studentInput") studentInput: ElementRef<HTMLInputElement>;

  actionForm: FormGroup;
  action: string;
  local_data: any;
  isLoading = false;
  filteredUsers: User[] = [];
  currentTeacherEmail: string;
  students: string[] = [];
  isLoadingStudents = false
  filteredStudents: User[] = [];

  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];

  studentsCtrl = new FormControl("", Validators.required);

  constructor(
    public dialogRef: MatDialogRef<TrainingDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: object,
    private formBuilder: FormBuilder,
    private readonly userService: UsersService
  ) {
    const newData: any = { ...data }
    this.action = newData.action;
    delete newData.action
    this.local_data = newData;

    if (this.action === "Add") {
      this.local_data.sessions = [];
      this.local_data.students = [];
    }
    if (this.action === 'Update') {
      const studentsEmails = []
      this.local_data.students.map(student => {
        studentsEmails.push(student.email)
      })
      this.students = studentsEmails
    }
  }

  ngOnInit(): void {
    this.actionForm = this.formBuilder.group({
      title: new FormControl("", Validators.required),
      subject: new FormControl("", Validators.required),
      teacherInput: new FormControl("", Validators.required)
    });

    this.actionForm
      .get('teacherInput')
      .valueChanges
      .pipe(
        debounceTime(500),
        tap(() => this.isLoading = true),
        switchMap(value => this.userService.elasticSearch(value, 1)
          .pipe(
            finalize(() => this.isLoading = false),
          )
        )
      )
      .subscribe(users => this.filteredUsers = users);

    this.studentsCtrl
      .valueChanges
      .pipe(
        debounceTime(500),
        tap(() => this.isLoadingStudents = true),
        switchMap(value => this.userService.elasticSearch(value, 1)
          .pipe(
            finalize(() => this.isLoadingStudents = false),
          )
        )
      )
      .subscribe(users => {
        // let aux: string[] = []
        // users.map(user => {
        //   aux.push(user.email)
        // })
        this.filteredStudents = users
      });

    if (this.action === 'Update') {
      this.actionForm.get('teacherInput').setValue(this.local_data.teacher.email)
    }
  }

  get f() {
    return this.actionForm.controls;
  }

  doAction() {
    // stop here if form is invalid
    if (this.actionForm.invalid) {
      return;
    }
    if (this.actionForm.get('teacherInput').value !== '') {
      this.local_data.teacher = this.actionForm.get('teacherInput').value
    }

    this.local_data.students = this.students

    this.dialogRef.close({ event: this.action, data: this.local_data });
  }

  closeDialog() {
    this.dialogRef.close({ event: "Cancel" });
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.students.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.studentsCtrl.setValue('');
    this.filteredStudents = []
  }

  remove(index: any): void {
    this.students.splice(index, 1);
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.students.push(event.option.value);
    this.studentInput.nativeElement.value = "";
    this.studentsCtrl.setValue('')
    this.filteredStudents = []
  }

}

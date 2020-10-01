import { Component, OnInit, Optional, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { Question } from '../interfaces/question';

@Component({
  selector: 'app-quizz-dialog',
  templateUrl: './quizz-dialog.component.html',
  styleUrls: ['./quizz-dialog.component.css']
})
export class QuizzDialogComponent implements OnInit {

  actionForm: FormGroup;
  action: string;
  local_data: Question;
  correctAnswers: string[] = []
  choices: string[]

  constructor(
    public dialogRef: MatDialogRef<QuizzDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder
  ) {
    const newData: any = { ...data }
    this.action = newData.action;
    delete newData.action
    this.local_data = newData;
  }

  ngOnInit(): void {
    if (this.action === 'Update') {
      this.correctAnswers = this.local_data.correctAnswers
      this.actionForm = this.formBuilder.group({
        question: new FormControl(this.local_data.question, Validators.required),
        answers: new FormArray([])
      })
      this.local_data.choices.map(choice => {
        if (this.correctAnswers.includes(choice)) {
          this.answers.push(new FormControl({ value: choice, disabled: true }, Validators.required))
        } else {
          this.answers.push(new FormControl(choice, Validators.required))
        }
      })
    } else if (this.action === 'Add') {
      this.actionForm = this.formBuilder.group({
        question: new FormControl('', Validators.required),
        answers: new FormArray([
          new FormControl('', Validators.required),
          new FormControl('', Validators.required),
          new FormControl('', Validators.required)
        ]),
      })
    }

  }

  get answers(): FormArray {
    return this.actionForm.get('answers') as FormArray;
  }

  addChoice() {
    this.answers.push(new FormControl('', Validators.required));
  }

  deleteChoice(i: number, value: any) {
    this.answers.removeAt(i)
    if (value) {
      const index = this.correctAnswers.indexOf(value)
      if (index > -1) {
        this.correctAnswers.splice(index, 1)
      }
    }
    // console.log(this.correctAnswers)
  }

  markAnswer(event: any, value: any, ctrlIndex: number) {
    // console.log(event,'-------',value,'++++++' ,ctrlIndex)
    if (event === true) {
      this.correctAnswers.push(value)
      this.answers.at(ctrlIndex).disable()
    } else {
      const index = this.correctAnswers.indexOf(value)
      if (index > -1) {
        this.correctAnswers.splice(index, 1)
        this.answers.at(ctrlIndex).enable()
      }
    }
    console.log(this.correctAnswers)
  }

  onSubmit() {
    if (this.actionForm.invalid) {
      return;
    }
    this.choices = []
    this.answers.controls.map(ctrl => {
      this.choices.push(ctrl.value)
    })

    if (this.action === 'Update') {
      this.local_data = {
        _id: this.local_data._id,
        question: this.actionForm.value.question,
        choices: this.choices,
        correctAnswers: this.correctAnswers
      }
    } else {
      this.local_data = {
        question: this.actionForm.value.question,
        choices: this.choices,
        correctAnswers: this.correctAnswers
      }
    }
    console.log(this.local_data)

    this.dialogRef.close({ event: this.action, data: this.local_data });
  }

  closeDialog() {
    this.dialogRef.close({ event: "Cancel" });
  }

}

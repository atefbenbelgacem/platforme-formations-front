import { Component, OnInit, Optional, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Session } from '../interfaces/session';

@Component({
  selector: 'app-session-dialog',
  templateUrl: './session-dialog.component.html',
  styleUrls: ['./session-dialog.component.css']
})
export class SessionDialogComponent implements OnInit {

  actionForm: FormGroup;
  action: string;
  local_data: Session;

  selectedHoursValue: number;
  selectedMinutesValue: number;

  selectedTimeHours: number;
  selectedTimeMinutes: number;

  timeChoice = [
    { value: 9, viewValue: "9AM" },
    { value: 10, viewValue: "10AM" },
    { value: 11, viewValue: "11AM" },
    { value: 14, viewValue: "2PM" },
    { value: 15, viewValue: "3PM" },
    { value: 16, viewValue: "4PM" },
    { value: 17, viewValue: "5PM" }
  ];

  hoursChoice = [
    { value: 1, viewValue: "1Hour" },
    { value: 2, viewValue: "2Hours" },
    { value: 3, viewValue: "3Hours" }
  ];
  minutesChoice = [
    { value: 0, viewValue: "0Minutes" },
    { value: 15, viewValue: "15Minutes" },
    { value: 30, viewValue: "30Minutes" },
    { value: 45, viewValue: "45Minutes" }
  ];

  datesFilter = (d: Date | null): boolean => {
    const day = (d || new Date()).getDay();
    // Prevent Saturday and Sunday from being selected.
    return day !== 0 && day !== 6;
  };


  constructor(public dialogRef: MatDialogRef<SessionDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder
  ) {
    const newData: any = { ...data }
    this.action = newData.action;
    delete newData.action
    this.local_data = newData;

    if (this.local_data.duration) {
      this.selectedHoursValue = this.local_data.duration.hours;
      this.selectedMinutesValue = this.local_data.duration.minutes;
    }
    if (this.local_data.date) {
      const newDate = new Date(this.local_data.date)
      this.selectedTimeHours = newDate.getHours();
      this.selectedTimeMinutes = newDate.getMinutes();
    }


  }

  ngOnInit(): void {

    this.actionForm = this.formBuilder.group({
      title: new FormControl("", Validators.required),
      date: new FormControl("", Validators.required),
      dateHours: new FormControl("", Validators.required),
      dateMinutes: new FormControl("", Validators.required),
      hours: new FormControl("", Validators.required),
      minutes: new FormControl("", Validators.required)
    });
  }

  get f() {
    return this.actionForm.controls;
  }

  doAction() {
    // stop here if form is invalid
    if (this.actionForm.invalid) {
      return;
    }

    this.local_data.duration = {
      hours: this.selectedHoursValue,
      minutes: this.selectedMinutesValue
    };
    const newDate = new Date(this.local_data.date)

    const years = newDate.getFullYear();
    const month = newDate.getMonth();
    const days = newDate.getDate();
    this.local_data.date = new Date(
      years,
      month,
      days,
      this.selectedTimeHours,
      this.selectedTimeMinutes
    );

    this.dialogRef.close({ event: this.action, data: this.local_data });
  }

  closeDialog() {
    this.dialogRef.close({ event: "Cancel" });
  }


}

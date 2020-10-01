import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { debounceTime, tap, switchMap, finalize } from 'rxjs/operators';
import { User } from '../interfaces/user';
import { Pole } from '../interfaces/pole';
import { VeilleEvent } from '../interfaces/veille-event';
import { UsersService } from '../services/users.service';
import { PoleService } from '../services/pole.service';

@Component({
  selector: 'app-veille-event-dialog',
  templateUrl: './veille-event-dialog.component.html',
  styleUrls: ['./veille-event-dialog.component.css']
})
export class VeilleEventDialogComponent implements OnInit {

  actionForm: FormGroup;
  action: string;
  local_data: VeilleEvent;
  isLoading: boolean = false
  filteredUsers: User[] = [];
  poles: Pole[] = []

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

  constructor(
    public dialogRef: MatDialogRef<VeilleEventDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private readonly userService: UsersService,
    private readonly poleService: PoleService
  ) {
    const newData: any = { ...data }
    this.action = newData.action;
    delete newData.action
    this.local_data = newData;
    poleService.getAllPoles().subscribe(res=>{
      this.poles = res
    })
  }

  ngOnInit(): void {
    if (this.action === "Add") {
      this.actionForm = this.formBuilder.group({
        title: new FormControl('', Validators.required),
        description: new FormControl('', Validators.required),
        datetime: this.formBuilder.group({
          date: new FormControl('', Validators.required),
          time: new FormControl('', Validators.required)
        }),
        duration: this.formBuilder.group({
          hours: new FormControl('', Validators.required),
          minutes: new FormControl('', Validators.required)
        }),
        pole: new FormControl('', Validators.required),
        presenter: new FormControl('', Validators.required)
      })
    } else {
      const newDate = new Date(this.local_data.date)
      const hour = ("0" + newDate.getHours()).slice(-2)
      const minut = ("0" + newDate.getMinutes()).slice(-2)
      const time = `${hour}:${minut}:00`
      this.actionForm = this.formBuilder.group({
        title: new FormControl(this.local_data.title, Validators.required),
        description: new FormControl(this.local_data.description, Validators.required),
        datetime: this.formBuilder.group({
          date: new FormControl(this.local_data.date, Validators.required),
          time: new FormControl(time, Validators.required)
        }),
        duration: this.formBuilder.group({
          hours: new FormControl(this.local_data.duration.hours, Validators.required),
          minutes: new FormControl(this.local_data.duration.minutes, Validators.required)
        }),
        pole: new FormControl(this.local_data.pole._id, Validators.required),
        presenter: new FormControl(this.local_data.presenter.email, Validators.required)
      })
    }

    this.actionForm
      .get('presenter')
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
  }

  onSubmit() {
    if (this.actionForm.invalid) {
      return;
    }
    const duration = this.actionForm.value.duration
    const newDate = new Date(this.actionForm.value.datetime.date)
    const years = newDate.getFullYear();
    const month = newDate.getMonth();
    const days = newDate.getDate();
    const newTime = this.actionForm.value.datetime.time.split(":")
    const datetime = new Date(
      years,
      month,
      days,
      newTime[0],
      newTime[1]
    );
    if (this.action === 'Add') {
      this.local_data = {
        title: this.actionForm.value.title,
        description: this.actionForm.value.description,
        date: datetime,
        duration: duration,
        presenter: this.actionForm.value.presenter,
        pole: this.actionForm.value.pole
      }
    } else {
      this.local_data = {
        _id: this.local_data._id,
        title: this.actionForm.value.title,
        description: this.actionForm.value.description,
        date: datetime,
        duration: duration,
        presenter: this.actionForm.value.presenter,
        pole: this.actionForm.value.pole
      }
    }


    this.dialogRef.close({ event: this.action, data: this.local_data });
  }

  closeDialog() {
    this.dialogRef.close({ event: "Cancel" });
  }

}

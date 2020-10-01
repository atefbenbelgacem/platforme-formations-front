import { Component, Inject, OnInit, Optional } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Pole } from '../interfaces/pole';

@Component({
  selector: 'app-poles-dialog',
  templateUrl: './poles-dialog.component.html',
  styleUrls: ['./poles-dialog.component.css'],
})
export class PolesDialogComponent implements OnInit {
  actionForm: FormGroup;
  action: string;
  local_data: Pole;

  constructor(
    public dialogRef: MatDialogRef<PolesDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder
  ) {
    const newData: any = { ...data };
    this.action = newData.action;
    delete newData.action;
    this.local_data = newData;
  }

  ngOnInit(): void {
    if (this.action === 'Add') {
      this.actionForm = this.formBuilder.group({
        name: new FormControl('', Validators.required),
      });
    } else {
      this.actionForm = this.formBuilder.group({
        name: new FormControl(this.local_data.name, Validators.required),
      });
    }
  }

  onSubmit() {
    if (this.actionForm.invalid) {
      return;
    }
    if (this.action === 'Add') {
      this.local_data = {
        name: this.actionForm.value.name,
      };
    } else {
      this.local_data = {
        _id: this.local_data._id,
        name: this.actionForm.value.name,
      };
    }

    this.dialogRef.close({ event: this.action, data: this.local_data });
  }

  closeDialog() {
    this.dialogRef.close({ event: 'Cancel' });
  }
}

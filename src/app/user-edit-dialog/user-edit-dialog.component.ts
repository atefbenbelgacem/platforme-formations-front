import { Component, Inject, OnInit, Optional } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Pole } from '../interfaces/pole';
import { User } from '../interfaces/user';
import { PoleService } from '../services/pole.service';

@Component({
  selector: 'app-user-edit-dialog',
  templateUrl: './user-edit-dialog.component.html',
  styleUrls: ['./user-edit-dialog.component.css'],
})
export class UserEditDialogComponent implements OnInit {
  actionForm: FormGroup;
  action: string;
  local_data: User;
  emailsList: string[] = [];
  poles: Pole[] = [];
  roles = [
    { value: 'Colab', viewValue: 'Collaborator' },
    { value: 'Admin', viewValue: 'Administrator' },
    { value: 'Manager', viewValue: 'Manager' },
  ];
  hide: boolean = true;

  constructor(
    public dialogRef: MatDialogRef<UserEditDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private readonly poleService: PoleService
  ) {
    const newData: any = { ...data };
    this.action = newData.action;
    this.emailsList = newData.emailsList;
    delete newData.emailsList;
    delete newData.action;
    this.local_data = newData;
    poleService.getAllPoles().subscribe((res) => {
      this.poles = res;
    });
  }

  ngOnInit(): void {
    if (this.action === 'Add') {
      this.actionForm = this.formBuilder.group({
        name: new FormControl('', Validators.required),
        lastName: new FormControl('', Validators.required),
        email: new FormControl(
          '',
          Validators.compose([
            Validators.required,
            Validators.email,
            this.emailExistValidator(this.emailsList),
          ])
        ),
        password: new FormControl(
          '',
          Validators.compose([Validators.required, Validators.minLength(4)])
        ),
        pole: new FormControl('', Validators.required),
        roleName: new FormControl('', Validators.required),
      });
    } else {
      this.actionForm = this.formBuilder.group({
        name: new FormControl(this.local_data.name, Validators.required),
        lastName: new FormControl(
          this.local_data.lastName,
          Validators.required
        ),
        pole: new FormControl(this.local_data.pole._id, Validators.required),
        roleName: new FormControl(
          this.local_data.roleName,
          Validators.required
        ),
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
        lastName: this.actionForm.value.lastName,
        email: this.actionForm.value.email,
        password: this.actionForm.value.password,
        pole: this.actionForm.value.pole,
        roleName: this.actionForm.value.roleName,
      };
    } else {
      this.local_data = {
        _id: this.local_data._id,
        name: this.actionForm.value.name,
        lastName: this.actionForm.value.lastName,
        pole: this.actionForm.value.pole,
        roleName: this.actionForm.value.roleName,
      };
    }

    this.dialogRef.close({ event: this.action, data: this.local_data });
  }

  closeDialog() {
    this.dialogRef.close({ event: 'Cancel' });
  }

  emailExistValidator(emails: string[]): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (emails.includes(control.value)) {
        return { emailExist: true };
      }
      return null;
    };
  }
}

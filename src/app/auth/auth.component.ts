import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AuthService } from './auth.service';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';


@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  notfoundEmail = "email not found"
  action = "dismiss"
  passwordIncorrect = "incorrect password"
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private readonly authService: AuthService,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: new FormControl('', Validators.compose([Validators.required, Validators.email])),
      password: new FormControl('', Validators.compose([Validators.required, Validators.minLength(4)]))
    })
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;

    this.authService.login(this.f.username.value, this.f.password.value)
      .subscribe(data => {
        this.loading = false
        this.submitted = false
        const currentUser = { user: data.user, token: data.access_token }
        console.log(currentUser)
        sessionStorage.setItem('currentUser', JSON.stringify(currentUser))
        if (data.user.roleName === "Admin") {
          this.router.navigate(['/training'])
        } else if (data.user.roleName === "Colab") {
          this.router.navigate(['/training/student'])
        }

      }, error => {
        this.loading = false
        this.submitted = false
        console.log(error.status)
        if (error.status === 404) {
          this._snackBar.open(this.notfoundEmail, this.action, {
            duration: 3000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
        } else {
          this._snackBar.open(this.passwordIncorrect, this.action, {
            duration: 3000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
        }
      })
  }
}


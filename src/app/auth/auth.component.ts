import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { UserService } from '../core/service/user.service';
import { SignUpUser, Client, User } from '../core/interface/User';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.sass']
})
export class AuthComponent implements OnInit {
  signUpForm;
  signInForm;
  color = 'primary';
  checked = false;
  error = new BehaviorSubject<String[]>([]);
  poleNames = ['phone', 'username', 'email']

  signInValidate = new BehaviorSubject<boolean>(true);
  signUpValidate = new BehaviorSubject<boolean>(true);

  constructor(private formBuilder: FormBuilder,
              private userService: UserService,
              private router: Router) {
    this.signUpForm = formBuilder.group({
      email: ['', [
        Validators.required,
        Validators.email
      ]],
      phone: ['', [
        Validators.required
      ]],
      fullName: ['', [
        Validators.required
      ]],
      password: ['', [
        Validators.required
      ]],
      username: ['', [
        Validators.required
      ]],
    });
  
    this.signInForm = formBuilder.group({
      id: ['', [
        Validators.required
      ]],
      password: ['', [
        Validators.required
      ]],
    });
  }

  checkAuthForm() {
    this.signInValidate.next(
      !(this.signInForm.get('password').errors === null
      && this.signInForm.get('id').errors === null));
  }

  checkSignUpForm() {
    this.signUpValidate.next(
      !(this.signUpForm.get('username').errors === null
      && this.signUpForm.get('password').errors === null
      && this.signUpForm.get('fullName').errors === null
      && this.signUpForm.get('phone').errors === null
      && this.signUpForm.get('email').errors === null));
  }

  logIn() {
    const data = this.signInForm.getRawValue();
    console.log(data);
  }

  signUp() {
    const data = this.signUpForm.getRawValue() as SignUpUser;
    data.roles = ["user"];
    this.userService.createUser(data)
      .subscribe(
        (user: User) => {
          user.password = data.password;
          this.userService.createClient(data)
          .subscribe(
            (client: Client) => {
              this.userService.setAuth(client, user);
              this.router.navigateByUrl('/gallery')
            }
          )
        },
        (err => {
          this.error.next([]);
          for (let reason of err.error.violations){
            if (this.poleNames.indexOf(reason.propertyPath) !== -1){
              this.error.value.push(reason.propertyPath + ": " + reason.message)
            }
          }
          console.log(this.error.value)
        }));
  }

  signIn(){
    const data = this.signInForm.getRawValue();
    this.userService.getClientFromServer(data)
      .subscribe((client: Client) => {
        const user = {
          username: client.name,
          password: data.password
        };
        this.userService.setAuth(client, user);
        this.router.navigateByUrl('/gallery');
      });
  }


  ngOnInit() {
    this.userService.isAuthenticated$
      .subscribe(
        (data) => data ? this.router.navigateByUrl('/gallery') : null
      )
  }

}

import { AccountService } from './../../services/account.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup ;

  constructor(
    private authService: AuthService,
    private account: AccountService,
    private token: TokenService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(8)])
    });
    console.log("error email : ",this.loginForm.get('email'));
    console.log("error password : ",this.loginForm.get('password'));
  }

  get inputRequired() { return this.loginForm.controls; }

  get email() { return this.loginForm.get('email'); }

  get password() { return this.loginForm.get('password'); }

  login() {
    this.authService.login(this.loginForm.value).subscribe(
      res => this.handleResponse(res)
    )
  }


  
  handleResponse(data:any) {
    this.token.handle(data);
    this.account.changeAuthStatus(true);
    console.log("handle data in login component : ",data);
    this.router.navigateByUrl('/livres');
  }

}

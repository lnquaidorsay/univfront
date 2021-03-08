import { AccountService } from './../../services/account.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { TokenService } from 'src/app/services/token.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup ;
  public jwtToken: string;
  public username: string;
  public roles: string[];

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
    const jwtHelper = new JwtHelperService(); //Decode le jwt
    const objJWT = jwtHelper.decodeToken(data.token);
    console.log('objJWT ',objJWT);
    this.roles = objJWT.roles; //Recupère les roles
    this.username = objJWT.username; //Recupère le username
    console.log('roles :  ',this.roles);
    console.log('username :  ',this.username);
    this.account.changeAuthStatus(true);
    console.log("handle data in login component : ",data);
    this.router.navigateByUrl('/livres'); //rediriger un utilisateur vers une route determiné
  }


  //installer la librairie @auth0/angular-jwt: npm install @auth0/angular-jwt --save
  decodeJWT() {
    const jwtHelper = new JwtHelperService(); //Decode le jwt
    const objJWT = jwtHelper.decodeToken(this.jwtToken);
    this.roles = objJWT.roles; //Recupère les roles
    this.username = objJWT.username; //Recupère le username
  }

}

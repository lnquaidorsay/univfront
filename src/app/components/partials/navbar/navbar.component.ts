import { TokenService } from './../../../services/token.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  public loggedIn: boolean = false;
  public userInfos: any = null;
  public currentUser = null

  constructor(
    private router: Router,
    private account: AccountService,
    private token: TokenService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.account.authStatus.subscribe(value => {
      this.loggedIn = value
      this.userInfos = this.token.getInfos();
      this.currentUser = this.token.getInfos();
      console.log("Current user in navbar : ",this.currentUser);
      console.log("userInfos user in navbar : ",this.userInfos);
    });
  }

  logout() {
    this.token.remove();
    this.toastr.info(
        `Déconnexion`,
        'Vous êtes déconnecter !',
        {
          timeOut: 7000,
          positionClass: 'toast-bottom-left'
        }
    )
    this.router.navigateByUrl('/login');
  }

}

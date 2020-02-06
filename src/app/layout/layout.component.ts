import { Component, OnInit } from '@angular/core';
import { UserService } from '../core/service/user.service';
import { Client } from '../core/interface/User';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.sass']
})
export class LayoutComponent implements OnInit {
  constructor(private userService: UserService) { }

  client: Client;
  isAuthenticated: boolean = false;

  logOut() {
    this.userService.purgeAuth();
  }

  ngOnInit() {
    this.userService.populate();
    this.client = this.userService.getClient();
    this.userService.isAuthenticated$.subscribe(isAuthenticated => this.isAuthenticated = isAuthenticated);
  }

  ngOnDestroy(): void {
    this.userService.purgeAuth();
  }

}

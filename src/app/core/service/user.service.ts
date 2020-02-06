import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { SignUpUser, Client, User } from '../interface/User';
import { ReplaySubject, BehaviorSubject, of } from 'rxjs';
import { TokenService } from './token.service';
import { catchError } from 'rxjs/operators';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private isAuthenticated = new ReplaySubject<boolean>(1);
  public isAuthenticated$ = this.isAuthenticated.asObservable();

  constructor(private apiService: ApiService,
              private tokenService: TokenService) { }

  createClient(user: SignUpUser) {
    const client = {
      name: user.username,
      allowedGrantTypes: ['password', 'refresh_token']
    }
    return this.apiService.post('api/clients', client)
  }

  getClientFromServer(client){
    return this.apiService.get('api/clients/' + client.id, new HttpParams);
  }

  createUser(user: SignUpUser) {
    return this.apiService.post('api/users', user);
  }

  setClient(client: Client) {
    localStorage.setItem('client', JSON.stringify(client));
  }
  
  getClient() {
    const client = JSON.parse(localStorage.getItem('client'));
    return client;
  }

  purgeClient() {
    localStorage.removeItem('client');
  }

  setUser(user: User) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  getUser() {
    const user = JSON.parse(localStorage.getItem('user'));
    return user;
  }

  purgeUser() {
    localStorage.removeItem('user');
  }

  setAuth(client: Client, user: User) {
    this.isAuthenticated.next(true);
    this.tokenService.receiveToken(client, user);
    this.setClient(client);
    this.setUser(user);
  }

  purgeAuth() {
    this.isAuthenticated.next(false);
    this.tokenService.purgeToken();
    this.purgeClient();
    this.purgeUser();
  }

  populate() {
    if (this.getClient() && this.getUser()){
      const client = this.getClient();
      const user = this.getUser();
      this.setAuth(client, user);
    }
  }
}

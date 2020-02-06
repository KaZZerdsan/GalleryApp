import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Client } from '../interface/User';
import { TokenResponse } from '../interface/Token';
import { HttpParams, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor(private apiService: ApiService) { }

  getToken() {
    return JSON.parse(localStorage.getItem('token'));
  }

  setToken(token) {
    const data = {
      refresh_token: token.refresh_token,
      access_token: token.access_token
    }
    localStorage.setItem('token', JSON.stringify(token));
  }

  purgeToken(){
    localStorage.removeItem('token');
  }

  receiveToken(client: Client, user) {
    const body = new HttpParams()
      .set('client_id', client.id + '_' + client.randomId)
      .set('client_secret', client.secret)
      .set('password', user.password)
      .set('username', user.username)
      .set('grant_type', 'password')
      console.log(body);
    this.apiService.post('oauth/v2/token', body)
      .subscribe(
        (token: TokenResponse) => this.setToken(token),
        (err) => console.log(err)
      );
  }

  updateToken(client: Client){
    const token = this.getToken();
    const body = new HttpParams()
      .set('client_id', client.id + '_' + client.randomId)
      .set('grant_type', 'refresh_token')
      .set('refresh_token',token.refresh_token)
      .set('client_secret', client.secret);
    this.apiService.post('oauth/v2/token', body)
      .subscribe(
        (token) => this.setToken(token),
        (err) => console.log(err)
      );
    console.log('success');
  }
}

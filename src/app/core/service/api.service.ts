import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  params = {
    params: {},
    headers: new HttpHeaders()
      .set('Accept', 'application/json')
      };

  constructor(private http: HttpClient) { }
  post(path: string, body: object) {
    const options = this.params;
    options.params = {};
    return this.http.post(`${path}`, body, options);
  }

  get(path: string, params: HttpParams) {
    const options = this.params;
    options.params = params;
    return this.http.get(`${path}`, options);
  }
}

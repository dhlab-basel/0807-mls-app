import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class KnoraApiService {

  constructor(private http: HttpClient) { }

  get(path: string, email?: string, password?: string): any {
    let headers;
    if ((email !== undefined) && (password !== undefined)) {
      headers = {
        headers: new HttpHeaders({
          Authorization: 'Basic' + btoa(email + ':' + password),
          'Content-Type': 'application/json'
        })
      };
    }
    if (headers === undefined) {
      return this.http.get(environment.server + path);
    } else {
      return this.http.get(environment.server + path, headers);
    }
  }

  post(path: string, data: any, email?: string, password?: string): any {
    let headers;
    if ((email !== undefined) && (password !== undefined)) {
      headers = {
        headers: new HttpHeaders({
          Authorization: 'Basic' + btoa(email + ':' + password),
          'Content-Type': 'application/json+ls'
        })
      };
    }
    if (headers === undefined) {
      return this.http.post(environment.server + path, data);
    } else {
      return this.http.post(environment.server + path, data, headers);
    }
  }
}

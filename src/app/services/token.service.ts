import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor() { }

  set(data: any) {
    console.log("data incoming backend :",data);
    localStorage.setItem('token', data.token);
    localStorage.setItem('id', data.id);
    localStorage.setItem('nom', data.nom);
  }

  handle(data:any) {
    this.set(data);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  getId() {
    return localStorage.getItem('id');
  }

  remove() {
    localStorage.removeItem('token');
    localStorage.removeItem('id');
    localStorage.removeItem('nom');
  }

  decode(payload:any) {
    console.log('payload : ', payload);
    return JSON.parse(atob(payload));
  }

  payload(token:any) {
    const payload = token.split('.')[1];
    console.log('payload : ', payload);
    return this.decode(payload);
  }


  isValid() {
    const token = this.getToken();
    const id = this.getId();

    if (token) {

      const payload = this.payload(token);
      if (payload) {
        return id == payload.id;
      }
    }
    return false;
  }

  getInfos() {

    const token = this.getToken();

    if (token) {
      const payload = this.payload(token);
      console.log('Payload : ',payload);
      console.log('token : ',token);
      return payload ? payload : null;
    }

    return null
  }


  loggedIn() {
    return this.isValid();
  }
}

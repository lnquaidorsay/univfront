import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor() { }

  set(data: any) {
    console.log("data incoming backend :",data);
       let tokenData = {
      token: data.token,
      id: data.id,
      nom: data.nom
    };
    localStorage.setItem('tokenData', JSON.stringify(tokenData));
    localStorage.setItem('token', tokenData.token);
    localStorage.setItem('id', tokenData.id);
    localStorage.setItem('nom', tokenData.nom);
  }


  handle(data:any) {
    this.set(data);
  }

  getToken() {
    var myObj = null;
    if(localStorage.getItem('tokenData') != null) {
      myObj = JSON.parse(localStorage.getItem('tokenData'));
      console.log("my token with object ",myObj.token);
      localStorage.setItem('token', myObj.token);
      localStorage.setItem('id', myObj.id);
      localStorage.setItem('nom', myObj.nom);
    }
    return localStorage.getItem('token');
  }

  getId() {
    return localStorage.getItem('id');
  }

  remove() {
    localStorage.clear();
    localStorage.removeItem('token');
    localStorage.removeItem('tokenData');
    localStorage.removeItem('id');
    localStorage.removeItem('nom');
  }

  decode(payload:any) {
    console.log('payload in decode function : ', payload);
    console.log('payload in decode function atob : ', JSON.parse(atob(payload)));
    return JSON.parse(atob(payload));
  }

  payload(token:any) {
    const payload = token.split('.')[1];
    return this.decode(payload);
  }


  isValid() {
    const token = this.getToken();
    const id = this.getId();

    if (token) {

      const payload = this.payload(token);
      console.log("isValid function payload : ",payload);
      if (payload) {
        return id == payload.id;
      }
    }
    return false;
  }

  getInfos() {

    const token = this.getToken();
    console.log("getinfos token :",token);
    if (token) {
      const payload = this.payload(token);
      return payload ? payload : null;
    }

    return null
  }


  loggedIn() {
    return this.isValid();
  }
}

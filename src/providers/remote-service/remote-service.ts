import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Common } from '../../common';
import 'rxjs/add/operator/map';

/*
  Generated class for the RemoteService provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class RemoteService {
  constructor(public http: Http) {
  }
  baseUrl: string = Common.SERVER_URL;
  assetsUrl: string = "assets/data/";
  get(apiUrl:string) {
    return this.http.get(this.baseUrl + apiUrl)
    .map(res => res.json());
  }
  post(apiUrl:string, content:any) {
    let header = new Headers();
    header.append("Content-type" , "text/plain;charset=\"utf-8\"");
    return this.http.post(this.baseUrl + apiUrl, content, {
      headers: header
    })
    .map(res => res.json());
  }
  uploadImage(post_data) {
    let url = 'https://api.tlogin.net/basium/f02';
    let result_data = JSON.stringify(post_data);
    let postData = new FormData();
    postData.append('attach_file' , result_data);    
    postData.append('api_key' , '5e7adaec-d577-40e1-9378-ca45a0a86330');    
    return this.http.post(url , postData)
    .map(res=> res.json()); 
  }
}

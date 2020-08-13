import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Constants } from '../shared/constants';
@Injectable({
    providedIn: 'root'
})

export class LogService {

    constructor(private http: HttpClient) {}

    getLog() {
        return this.http.get(`${Constants.mb}/logs`);
    }
}

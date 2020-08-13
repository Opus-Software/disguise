import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Constants } from '../shared/constants';
@Injectable({
  providedIn: 'root',
})
export class ImposterService {

  constructor(private http: HttpClient) {}

    getImposters(headers?: object): Observable<object[]> {
        return this.http.get<object[]>(`${Constants.mb}/imposters`, headers);
    }

    getImposter(port: number): Observable<object> {
        return this.http.get<object>(`${Constants.mb}/imposters/${port}`);
    }

    addStub(port: number, body: object): Observable<object> {
        return this.http.post<object>(`${Constants.mb}/imposters/${port}/stubs`, body);
    }

    postImposters(list: object, add?: boolean): Observable<object> {
        if (add) {
            if (list['stubs']) {
                const json = JSON.parse(list['stubs']);
                if (Array.isArray(json)) {
                    list['stubs'] = json;
                } else {
                    list['stubs'] = [json];
                }
            }
            if (list['defaultResponse']) {
                list['defaultResponse'] = this.parseField('defaultResponse', list);
            }
            if (list['endOfRequestResolver']) {
                list['endOfRequestResolver'] = this.parseField('endOfRequestResolver', list);
            }
        }
        return this.http.post<object>(`${Constants.mb}/imposters`, list);
    }

    deleteImposters(port: number): Observable<object> {
        return this.http.delete<object>(`${Constants.mb}/imposters/${port}`);
    }

    putStub(port: number, index: number, body: object): Observable<object> {
        return this.http.put<object>(`${Constants.mb}/imposters/${port}/stubs/${index}`, body);
    }

    deleteStub(port: number, index: number): Observable<object> {
        return this.http.delete<object>(`${Constants.mb}/imposters/${port}/stubs/${index}`);
    }

    parseField(field: string, obj: object): any {
        const json = JSON.parse(obj[field]);
        if (Array.isArray(json)) {
            return json[0];
        } else {
            return json;
        }
    }
}

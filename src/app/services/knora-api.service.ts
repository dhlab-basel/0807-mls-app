import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { KnoraJsonldSimplify, KnoraResource, KnoraValue, KnoraListValue  } from 'knora-jsonld-simplify';
import {map} from 'rxjs/operators';

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

  getKnoraResource(iri: string, level: number = 0) {
    const simplifier = new KnoraJsonldSimplify();
    return this.get('/v2/resources/' + encodeURIComponent(iri))
      .pipe(map(jsonobj => {
        const simple: KnoraResource = simplifier.simplify(jsonobj)[0]; // todo: error handling if resource not here
        const propnames = simple.getPropNames();
        console.log(propnames)
        let props: {[index: string]: Array<KnoraValue>} = {};
        for (const idx in propnames) {
          if (simple.isValue(propnames[idx])) {
            const nvals = simple.getNValues(propnames[idx]);
            const values: Array<KnoraValue> = [];
            for (let i = 0; i < nvals; i++) {
              values.push(simple.getValue(propnames[idx], i) as KnoraValue);
            }
            props[propnames[idx]] = values;
          } else if (simple.isResource(propnames[idx])) {
            // TODO: NOT YET IMPLEMENTED
          } else {
            // TODO: NOT YET IMPLEMENTED
          }
        }
        const strvals: {[index: string]: string} = {};
        const listvals: {[index: string]: KnoraListValue} = {};
        for(const name in props) {
          for (const val of props[name]) {
            const type = val.subtype;
            switch (type) {
              case 'KnoraTextValue': {
                strvals[name] = val.strval;
                break;
              }
              case 'KnoraListValue': {
                listvals[name] = val as KnoraListValue;
                break;
              }
              default: {
                strvals[name] = val.strval;
              }
            }
          }
        }
        return {strvals, listvals};
      })).pipe(
        map((x) => (x))
      );
  }
 }

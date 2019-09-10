import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { KnoraJsonldSimplify, KnoraResource, KnoraValue, KnoraListValue  } from 'knora-jsonld-simplify';
import { map, mergeMap } from 'rxjs/operators';
import { Observable, forkJoin, EMPTY, of } from 'rxjs';
import { AppInitService } from '../app-init.service';
import {isKnoraListValue} from 'knora-jsonld-simplify/dist/src';
import {GravsearchTemplatesService} from './gravsearch-templates.service';

export interface PropVal {
  proplabel: string;
  propvalues: Array<string>;
}

@Injectable({
  providedIn: 'root'
})

export class KnoraApiService {
  private simplifier;

  constructor(
    private http: HttpClient,
    private appInitService: AppInitService,
    private queryTemplates: GravsearchTemplatesService,
  ) {
    this.simplifier = new KnoraJsonldSimplify();
  }

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
      return this.http.get( this.appInitService.getSettings().server + path);
    } else {
      return this.http.get(this.appInitService.getSettings().server + path, headers);
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
      return this.http.post(this.appInitService.getSettings().server + path, data);
    } else {
      return this.http.post(this.appInitService.getSettings().server + path, data, headers);
    }
  }

  /**
   * Get the label of a list node
   *
   * @param iri IRI of the list node
   * @param valarr Array of values to which the node label should be added
   */
  getListNodeLabel(iri: string, valarr: Array<string>): Observable<Array<string>> {
    return this.get('/v2/node/' + encodeURIComponent(iri))
      .pipe(map((x: any) => valarr.push(x['rdfs:label'])));
  }

  /**
   * Get all information (properties) if a resourcee
   * @param iri IRI of the resource
   * @param labelmap A map which maps property nams to labels
   */
  getResource(iri: string, labelmap: {[index: string]: string}): Observable<KnoraResource> {
    return this.get('/v2/resources/' + encodeURIComponent(iri)).pipe(mergeMap(jsonobj => {
      const simple = this.simplifier.simplify(jsonobj).map((res) => {
        const result: {[index: string]: PropVal} = {};
        const obs: Array<Observable<Array<string>>> = [];
        for (const pname of res.getPropNames()) {
          const values: Array<string> = [];
          for (let i = 0; i < res.getNValues(pname); i++) {
            const value: KnoraValue | undefined = res.getValue(pname, i);
            if (value !== undefined) {
              switch (value.subtype) {
                case isKnoraListValue: {
                  const v = value as KnoraListValue;
                  obs.push(this.getListNodeLabel(v.nodeIri, values));
                  break;
                }
                default: {
                  values.push(value.strval);
                }
              }
            }
          } // for (let i = 0; i < res.getNValues(pname); i++)
          if (labelmap.hasOwnProperty(pname)) {
            result[pname] = {proplabel: labelmap[pname], propvalues: values};
          } else {
            result[pname] = {proplabel: pname, propvalues: values};
          }
        }
        if (obs.length > 0) {
          return forkJoin(obs).pipe(map((ar) => {
            return result;
          }));
        } else {
          return of(result);
        }
      });
      return simple[0];
    }));
  }

  gravsearchQueryCount(queryname: string, params: {[index: string]: string}): Observable<number> {
    params.ontology = this.appInitService.getSettings().ontologyPrefix;
    const query = this.queryTemplates[queryname](params);
    return this.post('/v2/searchextended/count', query)
      .pipe(map((data: any) => {
        return data['schema:numberOfItems'];
      }));
  }

  gravsearchQuery(queryname: string, params: {[index: string]: string}): Observable<Array<KnoraResource>> {
    params.ontology = this.appInitService.getSettings().ontologyPrefix;
    const query = this.queryTemplates[queryname](params);
    return this.post('/v2/searchextended', query)
      .pipe(map(jsonobj => {
        const simplifier = new KnoraJsonldSimplify();
        return simplifier.simplify(jsonobj);
      }));
  }

}

import { Injectable } from '@angular/core';
import { KnoraJsonldSimplify, KnoraResource, KnoraValue, KnoraListValue } from 'knora-jsonld-simplify';
import { KnoraApiService } from './knora-api.service';
import {map, mergeMap, take} from 'rxjs/operators';
import {isKnoraListValue} from 'knora-jsonld-simplify/dist/src';
import { Observable, forkJoin, EMPTY, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export interface PropVal {
  propname: string;
  propvalues: Array<string>;
}

export class GetResourceService {
  private simplifier;

  constructor(private knoraApi: KnoraApiService) {
    this.simplifier = new KnoraJsonldSimplify();
  }

  getListNodeLabel(iri: string) {
    return this.knoraApi.get('/v2/node/' + encodeURIComponent(iri))
      .pipe(map((x: any) => x['rdfs:label']));
  }

  getResource(iri: string, labelmap: {[index: string]: string}) {
    return this.knoraApi.get('/v2/resources/' + encodeURIComponent(iri)).pipe(mergeMap(jsonobj => {
      const simple = this.simplifier.simplify(jsonobj).map((res) => {
        const result: Array<PropVal> = [];
        const xx: Array<Observable<any>> = [];
        for (const pname of res.getPropNames()) {
          const values: Array<string> = [];
          for (let i = 0; i < res.getNValues(pname); i++) {
            const value: KnoraValue | undefined = res.getValue(pname, i);
            if (value !== undefined) {
              switch (value.subtype) {
                case isKnoraListValue: {
                  const v = value as KnoraListValue;
                  values.push(v.nodeIri);
                  xx.push(this.getListNodeLabel(v.nodeIri))
                  break;
                }
                default: {
                  values.push(value.strval);
                }
              }
            }
          } // for (let i = 0; i < res.getNValues(pname); i++)
          if (labelmap.hasOwnProperty(pname)) {
            result.push({propname: labelmap[pname], propvalues: values});
          } else {
            result.push({propname: pname, propvalues: values});
          }
        }
        return forkJoin(xx).pipe(map((ar) => {
          for (const gaga of ar) {
            console.log('=====>' + gaga);
          }
          return result;
        }));
      });
      return simple[0];
    }));
  }
}

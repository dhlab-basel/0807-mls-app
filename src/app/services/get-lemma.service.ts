import { Injectable } from '@angular/core';
import { KnoraJsonldSimplify, KnoraResource, KnoraValue, KnoraListValue  } from 'knora-jsonld-simplify';
import { KnoraApiService} from './knora-api.service';
import {map, mergeMap, concatMap, take} from 'rxjs/operators';
import {Observable, forkJoin, EMPTY, of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GetLemmaService {
  private simplifier;

  constructor(private knoraApi: KnoraApiService) {
    this.simplifier = new KnoraJsonldSimplify();
  }


  getListNodeLabel(iri: string, elename: string) {
    return this.knoraApi.get('/v2/node/' + encodeURIComponent(iri))
      .pipe(map((x: any) => {
        const obj: { [index: string]: string } = {};
        obj[elename] = x['rdfs:label']
        return obj;
      }));
  }

  getIdentity(data: { [index: string]: string }) {
    return of(data);
  }

  getFullLemma(iri: string) {
    return this.knoraApi.get('/v2/resources/' + encodeURIComponent(iri))
      .pipe(mergeMap(jsonobj => {
        const simple = this.simplifier.simplify(jsonobj).map((x) => {
          const lemmaType = x ? x.getValue('mls:hasLemmaType') : undefined;
          const lemmaText = x ? x.getValue('mls:hasLemmaText') : undefined;
          const lemmaStart = x ? x.getValue('mls:hasStartDate') : undefined;
          const lemmaEnd = x ? x.getValue('mls:hasEndDate') : undefined;
          const lemmaFamilyName = x ? x.getValue('mls:hasFamilyName') : undefined;
          const lemmaGivenName = x ? x.getValue('mls:hasGivenName') : undefined;
          const lemmaDeceased = x ? x.getValue('mls:hasDeceasedValue') : undefined;
          const lemmaSex = x ? x.getValue('mls:hasSex') : undefined;
          const lemmaRelevanceValue = x ? x.getValue('mls:hasRelevanceValue') : undefined;

          const res: { [index: string]: string } = {
            lemmaText: lemmaText ? lemmaText.strval : '-',
            lemmaFamilyName: lemmaFamilyName ? lemmaFamilyName.strval : '-',
            lemmaGivenName: lemmaGivenName ? lemmaGivenName.strval : '-',
            lemmaStart: lemmaStart ? lemmaStart.strval : '?',
            lemmaEnd: lemmaEnd ? lemmaEnd.strval : '?',
          };
          const xx: [Observable<{ [index: string]: string }>] = [
            this.getIdentity(res).pipe(take(1))
          ];
          if (lemmaSex) {
            xx.push(this.getListNodeLabel(lemmaSex.strval, 'lemmaSex').pipe(take(1)));
          } else {
            xx.push(this.getIdentity({lemmaSex: '?'}).pipe(take(1)));
          }
          if (lemmaType) {
            xx.push(this.getListNodeLabel(lemmaType.strval, 'lemmaType').pipe(take(1)));
          } else {
            xx.push(this.getIdentity({lemmaType: '?'}).pipe(take(1)));
          }
          if (lemmaRelevanceValue) {
            xx.push(this.getListNodeLabel(lemmaRelevanceValue.strval, 'lemmaRelevanceValue').pipe(take(1)));
          } else {
            xx.push(this.getIdentity({lemmaRelevanceValue: '?'}).pipe(take(1)));
          }
          if (lemmaDeceased) {
            xx.push(this.getListNodeLabel(lemmaDeceased.strval, 'lemmaDeceased').pipe(take(1)));
          } else {
            xx.push(this.getIdentity({lemmaDeceased: '?'}).pipe(take(1)));
          }

          return forkJoin(xx).pipe(map(([a, b, c, d, e]) => {
            return {...c, ...a, ...b, ...e, ...d};
          }));
        });

        return simple[0];
      }));
  }
}

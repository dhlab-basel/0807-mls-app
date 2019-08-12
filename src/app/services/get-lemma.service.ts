import { Injectable } from '@angular/core';
import { KnoraJsonldSimplify, KnoraResource, KnoraValue, KnoraListValue  } from 'knora-jsonld-simplify';
import { KnoraApiService} from './knora-api.service';
import {map, mergeMap, concatMap} from 'rxjs/operators';
import {Observable, forkJoin, EMPTY } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GetLemmaService {
  private simplifier;

  constructor(private knoraApi: KnoraApiService) {
    this.simplifier = new KnoraJsonldSimplify();
  }

  getNodeValue(iri: string, result, name) {
    return this.knoraApi.get('/v2/node/' + encodeURIComponent(iri))
      .pipe(map((x: any) => {
        const obj = {};
        obj[name] = x['rdfs:label'];

        return {...result, ...obj};
      }));
  }

  getLemma(iri: string): {[index: string]: string | KnoraValue | KnoraResource} {
    return this.knoraApi.get('/v2/resources/' + encodeURIComponent(iri))
      .pipe(map(jsonobj => {
        const simple = this.simplifier.simplify(jsonobj).map((x) => {
          const lemmaText = x ? x.getValue('mls:hasLemmaText') : undefined;
          const lemmaStart = x ? x.getValue('mls:hasStartDate') : undefined;
          const lemmaEnd = x ? x.getValue('mls:hasEndDate') : undefined;
          const lemmaFamilyName = x ? x.getValue('mls:hasFamilyName') : undefined;
          const lemmaGivenName = x ? x.getValue('mls:hasGivenName') : undefined;
          const lemmaDeceased = x ? x.getValue('mls:hasDeceasedValue') : undefined;
          const lemmaType = x ? x.getValue('mls:hasLemmaType') : undefined;
          const lemmaSex = x ? x.getValue('mls:hasSex') : undefined;

          return {
            lemma_text: lemmaText ? lemmaText.strval : '-',
            lemmaFamilyName: lemmaFamilyName ? lemmaFamilyName.strval : '-',
            lemmaGivenName: lemmaGivenName ? lemmaGivenName.strval : '-',
            lemmaStart: lemmaStart ? lemmaStart.strval : '?',
            lemmaEnd: lemmaEnd ? lemmaEnd.strval : '?',
            lemmaDeceased,
            lemmaType,
            lemmaSex
          };
        });

        console.log('SIMPLE: ', simple);
        return simple[0];
        })
      );
  }
/*
  getFullLemma(iri) {
    return this.getLemma(iri).pipe(
      mergeMap(x => {
        console.log('in MergeMap1....', x);
        if (x.lemmaSex && x.lemmaSex.subtype === 'KnoraListValue') {
          console.log('Doing second request....');
          const tmp = x.lemmaSex as KnoraListValue;
          console.log(tmp);
          return this.getNodeValue(tmp.nodeIri, x, 'lemmaSex');
        } else {
          console.log('Doing EMPTY...');
          return EMPTY;
        }
      }),
      mergeMap(x => {
        console.log('in MergeMap2....', x);
        if (x.lemmaDeceased && x.lemmaDeceased.subtype === 'KnoraListValue') {
          console.log('Doing second request....');
          const tmp = x.lemmaDeceased as KnoraListValue;
          console.log(tmp);
          return this.getNodeValue(tmp.nodeIri, x, 'lemmaDeceased');
        } else {
          console.log('Doing EMPTY...');
          return EMPTY;
        }
      }),
      mergeMap(x => {
        console.log('in MergeMap3....', x);
        if (x.lemmaType && x.lemmaType.subtype === 'KnoraListValue') {
          console.log('Doing second request....');
          const tmp = x.lemmaType as KnoraListValue;
          console.log(tmp);
          return this.getNodeValue(tmp.nodeIri, x, 'lemmaType');
        } else {
          console.log('Doing EMPTY...');
          return EMPTY;
        }
      }),

    );
  }
*/
          /*
          const obs: Array<any> = [];
          if (lemmaDeceasedValue && lemmaDeceasedValue.subtype === 'KnoraNodeValue') {
            const tmp = lemmaDeceasedValue as KnoraListValue;
            obs.push(this.knoraApi.get('/v2/node/' + encodeURIComponent(tmp.nodeIri)));
          }
          if (lemmaType && lemmaType.subtype === 'KnoraNodeValue') {
            const tmp = lemmaType as KnoraListValue;
            obs.push(this.knoraApi.get('/v2/node/' + encodeURIComponent(tmp.nodeIri)));
          }
          if (lemmaSex && lemmaSex.subtype === 'KnoraNodeValue') {
            const tmp = lemmaSex as KnoraListValue;
            obs.push(this.knoraApi.get('/v2/node/' + encodeURIComponent(tmp.nodeIri)));
          }
          console.log('before forkJoin');

          return forkJoin(obs).subscribe(result => {
            console.log('=====>', result[0]);
            return {
             lemma_text: lemmaText ? lemmaText.strval : '-',
              lemmaFamilyName: lemmaFamilyName ? lemmaFamilyName.strval : '-',
              lemmaGivenName: lemmaGivenName ? lemmaGivenName.strval : '-',
              lemma_start: lemmaStart ? lemmaStart.strval : '?',
              lemma_end: lemmaEnd ? lemmaEnd.strval : '?',
            };
          });
        });
      }));
  }
          */
}

import { Injectable } from '@angular/core';
import { KnoraJsonldSimplify, KnoraResource, KnoraValue, KnoraListValue  } from 'knora-jsonld-simplify';
import { KnoraApiService} from './knora-api.service';
import {map, mergeMap, concatMap, take} from 'rxjs/operators';
import {Observable, forkJoin, EMPTY, of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GetLexiconService {
  private simplifier;

  constructor(private knoraApi: KnoraApiService) {
    this.simplifier = new KnoraJsonldSimplify();
  }

  getLexicon(iri: string): Observable<{ [index: string]: string }> {
    return this.knoraApi.get('/v2/resources/' + encodeURIComponent(iri))
      .pipe(map(jsonobj => {
        const simple = this.simplifier.simplify(jsonobj).map((x) => {
          const lexiconShortname = x ? x.getValue('mls:hasShortname') : undefined;
          const lexiconCitation = x ? x.getValue('mls:hasCitationForm') : undefined;
          const lexiconYear = x ? x.getValue('mls:hasYear') : undefined;
          const lexiconComment = x ? x.getValue('mls:hasLexiconComment') : undefined;
          const lexiconWeblink = x ? x.getValue('mls:hasLexiconWeblink') : undefined;
          const lexiconLibrary = x ? x.getValue('mls:hasLibrary') : undefined;
          const lexiconIri = x ? x.iri : undefined;
          const retval: {[index: string]: string} = {};
          if (lexiconCitation) { retval.lexiconCitation = lexiconCitation.strval; }
          if (lexiconYear) { retval.lexiconYear = lexiconYear.strval; }
          if (lexiconShortname) { retval.lexiconShortname = lexiconShortname.strval; }
          if (lexiconComment) { retval.lexiconComment = lexiconComment.strval; }
          if (lexiconWeblink) { retval.lexiconWeblink = lexiconWeblink.strval; }
          if (lexiconLibrary) { retval.lexiconLibrary = lexiconLibrary.strval; }
          if (lexiconIri) { retval.lexicon_iri = lexiconIri.strval; }
          return retval;
        });
        return simple[0];
      }));
  }
}

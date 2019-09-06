import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { GravsearchTemplatesService} from './gravsearch-templates.service';
import { KnoraJsonldSimplify } from 'knora-jsonld-simplify';
import { KnoraApiService} from './knora-api.service';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})


export class GetLemmataService {

  constructor(private knoraApi: KnoraApiService,
              private queryTemplates: GravsearchTemplatesService) {
    this.page = 0;
  }

  get_lemmata(page: number = 0, start: string) {
    const query = this.queryTemplates.lemmata_query({ontology: environment.ontologyPrefix, page: String(page), start: start});
    return this.knoraApi.post('/v2/searchextended', query)
      .pipe(map(jsonobj => {
        const simplifier = new KnoraJsonldSimplify();
        return simplifier.simplify(jsonobj);
      }));
  }

  get_lemmata_count(start: string) {
    const params = {
      ontology: environment.ontologyPrefix,
        page: '0',
        start
    };
    const query = this.queryTemplates.lemmata_query(params);
    return this.knoraApi.post('/v2/searchextended/count', query)
      .pipe(map(data => {
        return data['schema:numberOfItems'];
      }));
  }

  search_lemmata(page: number, searchterm: string) {
    const params = {
      ontology: environment.ontologyPrefix,
      page: String(page),
      searchterm
    };
    const query = this.queryTemplates.lemmata_search(params);
    return this.knoraApi.post('/v2/searchextended', query)
      .pipe(map(jsonobj => {
        const simplifier = new KnoraJsonldSimplify();
        return simplifier.simplify(jsonobj);
      }));
  }

  search_lemmata_count(searchterm: string) {
    const params = {
      ontology: environment.ontologyPrefix,
      page: '0',
      searchterm
    };
    const query = this.queryTemplates.lemmata_search(params);
    return this.knoraApi.post('/v2/searchextended/count', query)
      .pipe(map(data => {
        return data['schema:numberOfItems'];
      }));
  }

}

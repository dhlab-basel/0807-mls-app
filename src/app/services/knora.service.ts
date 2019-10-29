import { Injectable } from '@angular/core';
import {
  KnoraApiConfig,
  KnoraApiConnection,
  ReadBooleanValue, ReadDateValue, ReadDecimalValue, ReadIntValue, ReadLinkValue, ReadListValue,
  ReadResource, ReadStillImageFileValue,
  ReadTextValueAsString, ReadUriValue, ReadValue
} from "@knora/api";
import { CountQueryResponse} from "@knora/api/src/models/v2/search/count-query-response";

import { AppInitService } from '../app-init.service';
import { Observable } from "rxjs";
import { map, mergeMap } from 'rxjs/operators';
import {Constants} from "@knora/api/src/models/v2/Constants";
import {KnoraDate, KnoraPeriod, Precision} from "@knora/api/src/models/v2/resources/values/read-date-value";
import {stringify} from "querystring";
import {GravsearchTemplatesService} from "./gravsearch-templates.service";

const __file__ = "knora.services.ts";

export interface ResourceData {
  id: string;
  label: string;
  properties: Array<{propname: string; label: string; values: Array<string>}>;
}

@Injectable({
  providedIn: 'root'
})

export class KnoraService {
  knoraApiConnection: KnoraApiConnection;
  mlsOntology: string;

  // this.appInitService.getSettings().server
  constructor(
    private appInitService: AppInitService,
    private queryTemplates: GravsearchTemplatesService
  ) {
    const protocol = this.appInitService.getSettings().protocol;
    const servername = this.appInitService.getSettings().servername;
    const port = this.appInitService.getSettings().port;
    const config = new KnoraApiConfig('http', servername, port, undefined, undefined, true);
    this.knoraApiConnection = new KnoraApiConnection(config);
    this.mlsOntology = appInitService.getSettings().ontologyPrefix + '/ontology/0807/mls/v2#';
  }

  private processResourceProperties(data: ReadResource): Array<{propname: string; label: string; values: Array<string> }> {
    const propdata: Array<{propname: string;  label: string; values: Array<string>}> = [];
    for (const prop in data.properties) {
      if (data.properties.hasOwnProperty(prop)) {
        const label: string = data.getValues(prop)[0].propertyLabel ? data.getValues(prop)[0].propertyLabel as string : '?';
        const values: Array<string> = data.getValuesAsStringArray(prop);
        propdata.push({propname: prop, label: label, values: values});
      }
    }
    return propdata;
  }

  private processSearchResult(datas: Array<ReadResource>, fields: Array<string>): Array<Array<string>> {
    const result: Array<Array<string>> = [];
    datas.map((data: ReadResource) => {
      const proparr: Array<string> = [];
      let idx: number;
      idx = fields.indexOf('arkUrl');
      if (idx > -1) {
        proparr[idx] = data.arkUrl;
      }
      idx = fields.indexOf('id');
      if (idx > -1) {
        proparr[idx] = data.id;
      }
      idx = fields.indexOf('label');
      if (idx > -1) {
        proparr[idx] = data.label;
      }
      for (const prop in data.properties) {
        if (data.properties.hasOwnProperty(prop)) {
          const index = fields.indexOf(prop);
          if (index > -1) {
            proparr[index] = data.getValuesAsStringArray(prop)[0];
          }
        }
      }
      result.push(proparr);
    });

    return result;
  }

  getResource(iri: string): Observable<ResourceData> {
    return this.knoraApiConnection.v2.res.getResource(iri).pipe(
      map((data: ReadResource) => {
        return {id: data.id, label: data.label, properties: this.processResourceProperties(data)};
      }
    ));
  }

  gravsearchQueryCount(queryname: string, params: {[index: string]: string}): Observable<number> {
    params.ontology = this.appInitService.getSettings().ontologyPrefix;
    const query = this.queryTemplates[queryname](params);
    return this.knoraApiConnection.v2.search.doExtendedSearchCountQuery(query).pipe(
      map((data: CountQueryResponse) => {
        return data.numberOfResults;
      }));
  }

  gravsearchQuery(queryname: string, params: {[index: string]: string}, fields: Array<string>): Observable<Array<Array<string>>> {
    params.ontology = this.appInitService.getSettings().ontologyPrefix;
    const query = this.queryTemplates[queryname](params);
    return this.knoraApiConnection.v2.search.doExtendedSearch(query).pipe(
      map((data: Array<ReadResource>) => {
        console.log(data);
        return this.processSearchResult(data, fields);
      }));
  }

}

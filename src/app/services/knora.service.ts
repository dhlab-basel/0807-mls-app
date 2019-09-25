import { Injectable } from '@angular/core';
import {
  KnoraApiConfig,
  KnoraApiConnection,
  ListNodeCache,
  OntologyCache, ReadBooleanValue, ReadDateValue, ReadDecimalValue, ReadIntValue, ReadLinkValue, ReadListValue,
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
  ontologyCache: OntologyCache;
  listNodeCache: ListNodeCache;
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
    this.ontologyCache = new OntologyCache(this.knoraApiConnection, config);
    this.listNodeCache = new ListNodeCache(this.knoraApiConnection);
    this.mlsOntology = appInitService.getSettings().ontologyPrefix + '/ontology/0807/mls/v2#';
  }

  private propToString(data: ReadResource, prop: string): Array<string> {
    const values: Array<string> = [];
    // const type = data.getValuesType(prop);
    // switch(type) {
    switch (data.getValues(prop)[0].type) {
      case Constants.KnoraApiV2 + Constants.Delimiter + 'IntegerValue': {
        const vals: Array<ReadIntValue> = data.getValuesAs(prop, ReadIntValue);
        for (const val of vals) {
          values.push(val.int ? val.int.toString() : '?');
        }
        break;
      }
      case Constants.KnoraApiV2 + Constants.Delimiter + 'BooleanValue': {
        const vals: Array<ReadBooleanValue> = data.getValuesAs(prop, ReadBooleanValue);
        for (const val of vals) {
          values.push(val.bool ? '1' : '0');
        }
        break;
      }
      case Constants.KnoraApiV2 + Constants.Delimiter + 'DecimalValue': {
        const vals: Array<ReadDecimalValue> = data.getValuesAs(prop, ReadDecimalValue);
        for (const val of vals) {
          values.push(val.decimal ? val.decimal.toString() : '0');
        }
        break;
      }
      case Constants.KnoraApiV2 + Constants.Delimiter + 'UriValue': {
        const vals: Array<ReadUriValue> = data.getValuesAs(prop, ReadUriValue);
        for (const val of vals) {
          values.push(val.uri ? val.uri : '0');
        }
        break;
      }
      case Constants.KnoraApiV2 + Constants.Delimiter + 'TextValue': {
        const vals: Array<ReadTextValueAsString> = data.getValuesAs(prop, ReadTextValueAsString);
        for (const val of vals) {
          values.push(val.text ? val.text : '?');
        }
        break;
      }
      case Constants.KnoraApiV2 + Constants.Delimiter + 'ListValue': {
        const vals: Array<ReadListValue> = data.getValuesAs(prop, ReadListValue);
        for (const val of vals) {
          values.push(val.listNodeLabel ? val.listNodeLabel : '?');
        }
        break;
      }
      case Constants.KnoraApiV2 + Constants.Delimiter + 'DateValue': {
        const vals: Array<ReadDateValue> = data.getValuesAs(prop, ReadDateValue);
        for (const val of vals) {
          let datestr: string;
          if (val.date instanceof KnoraPeriod) {
            datestr = val.date.start.year.toString();
            if (val.date.start.precision === Precision.monthPrecision && val.date.start.month) {
              datestr += '/' + val.date.start.month.toString();
            }
            if (val.date.start.precision === Precision.dayPrecision && val.date.start.day) {
              datestr += '/' + val.date.start.day.toString();
            }
            datestr += ' - ' + val.date.end.year.toString();
            if (val.date.end.precision === Precision.monthPrecision && val.date.end.month) {
              datestr += '/' + val.date.end.month.toString();
            }
            if (val.date.end.precision === Precision.dayPrecision && val.date.end.day) {
              datestr += '/' + val.date.end.day.toString();
            }
          } else if (val.date instanceof KnoraDate) {
            datestr = val.date.year.toString();
            if (val.date.precision === Precision.monthPrecision && val.date.month) {
              datestr += '/' + val.date.month.toString();
            }
            if (val.date.precision === Precision.dayPrecision && val.date.day) {
              datestr += '/' + val.date.day.toString();
            }
          } else {
            // ToDo: error message
          }
        }
        break;
      }
      case Constants.KnoraApiV2 + Constants.Delimiter + 'StillImageFileValue': {
        const vals: Array<ReadStillImageFileValue> = data.getValuesAs(prop, ReadStillImageFileValue);
        for (const val of vals) {
          console.log(val);
          values.push(val.fileUrl ? val.fileUrl : 'http://null');
        }
        break;
      }
      case Constants.KnoraApiV2 + Constants.Delimiter + 'LinkValue': {
        const vals: Array<ReadLinkValue> = data.getValuesAs(prop, ReadLinkValue);
        for (const val of vals) {
          values.push(val.linkedResourceIri ? val.linkedResourceIri : 'http://null');
        }
        break;
      }
      default: {
        console.log('DEFAULT:::::', data.getValues(prop)[0].type);
        const vals: Array<ReadValue> = data.getValuesAs(prop, ReadValue);
        for (const val of vals) {
          values.push(data.getValues(prop)[0].type);
        }
      }
    }

    return values;
  }

  private processResourceProperties(data: ReadResource): Array<{propname: string; label: string; values: Array<string> }> {
    const propdata: Array<{propname: string;  label: string; values: Array<string>}> = [];
    for (const prop in data.properties) {
      if (data.properties.hasOwnProperty(prop)) {
        const label: string = data.getValues(prop)[0].propertyLabel ? data.getValues(prop)[0].propertyLabel as string : '?';
        const values: Array<string> = this.propToString(data, prop);
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
            proparr[index] = this.propToString(data, prop)[0];
          }
        }
      }
      result.push(proparr);
    });

    return result;
  }

  getResource(iri: string): Observable<ResourceData> {
    return this.knoraApiConnection.v2.res.getResource(iri, this.ontologyCache, this.listNodeCache).pipe(
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
    return this.knoraApiConnection.v2.search.doExtendedSearch(query, this.ontologyCache, this.listNodeCache).pipe(
      map((data: Array<ReadResource>) => {
        return this.processSearchResult(data, fields);
      }));
  }

}

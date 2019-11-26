import {Injectable} from '@angular/core';
import {
  ApiResponseData,
  Cardinality,
  KnoraApiConfig,
  KnoraApiConnection,
  LoginResponse,
  LogoutResponse,
  ReadLinkValue,
  ReadOntology,
  ReadResource,
  ResourcePropertyDefinition
} from "@knora/api";
import {CountQueryResponse} from "@knora/api/src/models/v2/search/count-query-response";

import {AppInitService} from '../app-init.service';
import {Observable, of} from "rxjs";
import {catchError, map} from 'rxjs/operators';
import {GravsearchTemplatesService} from "./gravsearch-templates.service";

const __file__ = "knora.services.ts";

export interface ResourceData {
  id: string;
  label: string;
  properties: Array<{propname: string; label: string; values: Array<string>}>;
}

export interface LemmaData {
  id: string;
  label: string;
  properties: {[index: string]: {label: string, values: Array<string>}};
}

export interface ResInfoProps {
  label?: string;
  cardinality: string;
  comment?: string;
  guiElement?: string;
  guiAttributes?: Array<string>;
  subjectType?: string;
  objectType?: string;
  isEditable?: boolean;
  isLinkProperty?: boolean;
  isLinkValueProperty?: boolean;
}

export interface ResInfo {
  id: string;
  label: string;
  comment: string;
  properties: {[index: string]: ResInfoProps};
}

@Injectable({
  providedIn: 'root'
})

export class KnoraService {
  knoraApiConnection: KnoraApiConnection;
  mlsOntology: string;
  loggedin: boolean;
  useremail: string;

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
    this.loggedin = false;
    this.useremail = '';
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
            if (prop === 'http://api.knora.org/ontology/knora-api/v2#hasIncomingLinkValue') {
              const tmp = data.getValuesAs(prop, ReadLinkValue)[0];
              proparr[index] = tmp.linkedResourceIri;
            } else {
              proparr[index] = data.getValuesAsStringArray(prop)[0];
            }
          }
        }
      }
      result.push(proparr);
    });

    return result;
  }

  login(email: string, password: string): Observable<{success: boolean, token: string, user: string}> {
    return this.knoraApiConnection.v2.auth.login('email', email, password)
      .pipe(
        catchError((err) => {
          return of(err.error.response['knora-api:error']);
        }),
        map((response) => {
          if (response instanceof ApiResponseData) {
            const apiResponse = response as ApiResponseData<LoginResponse>;
            this.loggedin = true;
            this.useremail = email;
            return {success: true, token: apiResponse.body.token, user: email};
          } else {
            return {success: false, token: response, user: '-'};
          }
        }));
  }

  logout(): Observable<string> {
    return this.knoraApiConnection.v2.auth.logout().pipe(
      catchError((err) => {
        return of(err.error.response['knora-api:error']);
      }),
      map((response) => {
        if (response instanceof ApiResponseData) {
          const apiResponse = response as ApiResponseData<LogoutResponse>;
          this.loggedin = false;
          this.useremail = '';
          return apiResponse.body.message;
        } else {
          return response;
        }
      }));
  }

  getOntology(iri: string): Observable<ReadOntology> {
    return this.knoraApiConnection.v2.onto.getOntology(iri).pipe(
      map((data: ReadOntology) => data)
    );
  }

  getResinfo(ontoIri: string, resIri: string): Observable<ResInfo> {
    return this.knoraApiConnection.v2.onto.getOntology(ontoIri).pipe(
      map((data: ReadOntology) => {
        const resInfo: ResInfo = {
          id: data.classes[resIri].id,
          comment: data.classes[resIri].comment ? data.classes[resIri].comment as string : '',
          label: data.classes[resIri].label ? data.classes[resIri].label as string : '',
          properties: {}
        };
        for (const prop of data.classes[resIri].propertiesList) {
          const propNamesParts = prop.propertyIndex.split('#');
          if ((propNamesParts[0] === "http://api.knora.org/ontology/knora-api/v2")
            || (propNamesParts[0] === "http://www.w3.org/2000/01/rdf-schema")) {
            continue;
          }
          let cardinalityStr: string = '';
          switch (prop.cardinality) {
            case Cardinality._1: cardinalityStr = '1'; break;
            case Cardinality._0_1: cardinalityStr = '0-1'; break;
            case Cardinality._0_n: cardinalityStr = '0-n'; break;
            case Cardinality._1_n: cardinalityStr = '1-n'; break;
          }
          const pdata = data.properties[prop.propertyIndex] as ResourcePropertyDefinition;
          const propInfo: ResInfoProps = {
            cardinality: cardinalityStr,
            label: pdata.label,
            comment: pdata.comment,
            subjectType: pdata.subjectType,
            objectType: pdata.objectType,
            guiElement: pdata.guiElement,
            guiAttributes: pdata.guiAttributes,
            isEditable: pdata.isEditable,
            isLinkProperty: pdata.isLinkProperty,
            isLinkValueProperty: pdata.isLinkValueProperty
          };
          resInfo.properties[prop.propertyIndex] = propInfo;
        }
        return resInfo;
      })
    );

  }

  getResource(iri: string): Observable<ResourceData> {
    return this.knoraApiConnection.v2.res.getResource(iri).pipe(
      map((data: ReadResource) => {
        console.log(data.userHasPermission);
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
        return this.processSearchResult(data, fields);
      }));
  }

  private processLemmaProperties(data: ReadResource): {[index: string]: {label: string, values: Array<string>}} {
    const propdata: {[index: string]: {label: string, values: Array<string>}} = {};
    for (const prop in data.properties) {
      if (data.properties.hasOwnProperty(prop)) {
        const label: string = data.getValues(prop)[0].propertyLabel ? data.getValues(prop)[0].propertyLabel as string : '?';
        const values: Array<string> = data.getValuesAsStringArray(prop);
        propdata[prop] = {label: label, values: values};
      }
    }
    return propdata;
  }

  getLemma(iri: string): Observable<LemmaData> {
    return this.knoraApiConnection.v2.res.getResource(iri).pipe(
      map((data: ReadResource) => {
          return {id: data.id, label: data.label, properties: this.processLemmaProperties(data)};
        }
      ));
  }


}

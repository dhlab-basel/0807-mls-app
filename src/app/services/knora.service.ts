import {Injectable} from '@angular/core';
import {
  KnoraApiConnection,
  KnoraApiConfig,
  ApiResponseData,
  Cardinality,
  ReadResource,
  ReadResourceSequence,
  ReadOntology,
  ReadListValue,
  LoginResponse,
  LogoutResponse,
  ReadLinkValue,
  Constants,
  ReadTextValueAsString,
  ResourcePropertyDefinition,
  CountQueryResponse,
  ListAdminCache,
  ListResponse,
  ListNodeV2,
  ApiResponseError,
  CreateResource,
  CreateLinkValue,
  ILabelSearchParams,
  CreateTextValueAsXml,
  CreateTextValueAsString
} from '@dasch-swiss/dsp-js';

import {AppInitService} from '../app-init.service';
import {Observable, of} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';
import {GravsearchTemplatesService} from './gravsearch-templates.service';


/**
 * Data structures for properties from a resource (instance)
 */
export class PropertyData {
  constructor(public propname: string,
              public label: string,
              public values: Array<string>,
              public ids: Array<string>,
              public comments: Array<string | undefined>,
              public permissions: Array<string>) {}
}

export class ListPropertyData extends PropertyData {
  public nodeIris: Array<string>;

  constructor(propname: string,
              label: string,
              nodeIris: Array<string>,
              values: Array<string>,
              ids: Array<string>,
              comments: Array<string | undefined>,
              permissions: Array<string>) {
    super(propname, label, values, ids, comments, permissions);
    this.nodeIris = nodeIris;
  }
}

export class LinkPropertyData extends PropertyData {
  public resourceIris: Array<string>;
  public resourceLabels: Array<string>;

  constructor(propname: string,
              label: string,
              resourceIris: Array<string>,
              values: Array<string>,
              ids: Array<string>,
              comments: Array<string | undefined>,
              permissions: Array<string>) {
    super(propname, label, values, ids, comments, permissions);
    this.resourceIris = resourceIris;
  }
}


/**
 *  Data structure for representing a resource (instance)
 */
export interface ResourceData {
  id: string; /** Id (iri) of the resource */
  label: string; /** Label of the resource */
  permission: string; /** permission of the current user */
  properties: Array<PropertyData>; /** Array of properties with associated value(s) */
}

export interface LemmaData {
  id: string;
  label: string;
  permission: string; /** permission of the current user */
  arkUrl: string;
  properties: {[index: string]: {label: string, values: Array<string>}};
}

/**
 * Data structure representing the information about the property definitions of resource class
 */
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


export class ArticleData {
  constructor(
    public label: string,
    public lemma: string,
    public lemmaIri: string,
    // public lexicon: string,
    public lexiconIri: string,
    public article: string,
    public fonoteca?: string,
    public hls?: string,
    public oem?: string,
    public theatre?: string,
    public ticino?: string,
    public web?: string
) {
  }
}



@Injectable({
  providedIn: 'root'
})

export class KnoraService {
  knoraApiConnection: KnoraApiConnection;
  mlsOntology: string;
  loggedin: boolean;
  useremail: string;
  listAdminCache: ListAdminCache;

  constructor(
    private appInitService: AppInitService,
    private queryTemplates: GravsearchTemplatesService
  ) {
    const protocol = this.appInitService.getSettings().protocol;
    const servername = this.appInitService.getSettings().servername;
    const port = this.appInitService.getSettings().port;
    const config = new KnoraApiConfig(protocol, servername, port, undefined, undefined, true);
    this.knoraApiConnection = new KnoraApiConnection(config);
    this.mlsOntology = appInitService.getSettings().ontologyPrefix + '/ontology/0807/mls/v2#';
    this.loggedin = false;
    this.useremail = '';
    this.listAdminCache = new ListAdminCache(this.knoraApiConnection.admin);
  }

  private processResourceProperties(data: ReadResource): Array<PropertyData> {
    const propdata: Array<PropertyData> = [];
    for (const prop in data.properties) {
      if (data.properties.hasOwnProperty(prop)) {
        switch (data.getValues(prop)[0].type) {
          case Constants.TextValue: {
            const vals = data.getValuesAs(prop, ReadTextValueAsString);
            const label: string = vals[0].propertyLabel || '?';
            const values: Array<string> = vals.map(v => v.text);
            const ids: Array<string> = vals.map(v => v.id);
            const comments: Array<string | undefined> = vals.map(v => v.valueHasComment);
            const permissions: Array<string> = vals.map(v => v.userHasPermission);
            propdata.push(new PropertyData(prop, label, values, ids, comments, permissions));
            break;
          }
          case Constants.ListValue: {
            const vals = data.getValuesAs(prop, ReadListValue);
            const label: string = vals[0].propertyLabel || '?';
            const values: Array<string> = vals.map(v => v.listNodeLabel);
            const nodeIris: Array<string> = vals.map(v => v.listNode);
            const ids: Array<string> = vals.map(v => v.id);
            const comments: Array<string | undefined> = vals.map(v => v.valueHasComment);
            const permissions: Array<string> = vals.map(v => v.userHasPermission);
            propdata.push(new ListPropertyData(prop, label, nodeIris, values, ids, comments, permissions));
            break;
          }
          case Constants.LinkValue: {
            const vals = data.getValuesAs(prop, ReadLinkValue);
            const label: string = vals[0].propertyLabel || '?';
            const values: Array<string> = vals.map(v => v.linkedResource && v.linkedResource.label || '?');
            const resourceIris: Array<string> = vals.map(v => v.linkedResourceIri);
            const ids: Array<string> = vals.map(v => v.id);
            const comments: Array<string | undefined> = vals.map(v => v.valueHasComment);
            const permissions: Array<string> = vals.map(v => v.userHasPermission);
            propdata.push(new LinkPropertyData(prop, label, resourceIris, values, ids, comments, permissions));
            break;
          }
          default: {
            const vals = data.getValuesAs(prop, ReadTextValueAsString);
            const label: string = vals[0].propertyLabel || '?';
            const values: Array<string> = vals.map(v => v.text);
            const ids: Array<string> = vals.map(v => v.id);
            const comments: Array<string | undefined> = vals.map(v => v.valueHasComment);
            const permissions: Array<string> = vals.map(v => v.userHasPermission);
            propdata.push(new PropertyData(prop, label, values, ids, comments, permissions));
          }
        }
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
    return this.knoraApiConnection.v2.ontologyCache.getOntology(iri).pipe( // ToDo: Use cache
      map((cachedata: Map<string, ReadOntology>)  => cachedata.get(iri) as ReadOntology)
    );
  }

  getResinfo(ontoIri: string, resIri: string): Observable<ResInfo> {
    console.log('=====> getResinfo(1)', ontoIri, resIri);
    return this.knoraApiConnection.v2.ontologyCache.getOntology(ontoIri).pipe(  // ToDo: Use Cache
      map((cachedata: Map<string, ReadOntology>) => {
        console.log('=====> getResinfo(2)', cachedata);
        const data = cachedata.get(ontoIri) as ReadOntology;
        const resInfo: ResInfo = {
          id: data.classes[resIri].id,
          comment: data.classes[resIri].comment ? data.classes[resIri].comment as string : '',
          label: data.classes[resIri].label ? data.classes[resIri].label as string : '',
          properties: {}
        };
        for (const prop of data.classes[resIri].propertiesList) {
          const propNamesParts = prop.propertyIndex.split('#');
          if ((propNamesParts[0] === 'http://api.knora.org/ontology/knora-api/v2')
            || (propNamesParts[0] === 'http://www.w3.org/2000/01/rdf-schema')) {
            continue;
          }
          let cardinalityStr = '';
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
      }, catchError(error => {console.log(error); return error; }))
    );
  }

  getResource(iri: string): Observable<ResourceData> {
    return this.knoraApiConnection.v2.res.getResource(iri).pipe(
      map((data: ReadResource) => {
        console.log('GET_RESOURCE:', data);
        return {
          id: data.id,
          label: data.label,
          permission: data.userHasPermission,
          properties: this.processResourceProperties(data)};
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
    return this.knoraApiConnection.v2.search.doExtendedSearch(query)
      .pipe(
      map((data: ReadResourceSequence) => {
        console.log('^^^^^^^^^', data);
        return this.processSearchResult(data.resources, fields);
      }));
  }

  private processLemmaProperties(data: ReadResource): {[index: string]: {label: string, values: Array<string>}} {
    const propdata: {[index: string]: {label: string, values: Array<string>}} = {};
    for (const prop in data.properties) {
      if (data.properties.hasOwnProperty(prop)) {
        const label: string = data.getValues(prop)[0].propertyLabel ? data.getValues(prop)[0].propertyLabel as string : '?';
        const values: Array<string> = data.getValuesAsStringArray(prop);
        propdata[prop] = {label, values};
      }
    }
    return propdata;
  }

  getLemma(iri: string): Observable<LemmaData> {
    return this.knoraApiConnection.v2.res.getResource(iri).pipe(
      map((data: ReadResource) => {
        console.log('=*=*=*=*=', data);
        return {
            id: data.id,
            label: data.label,
            permission: data.userHasPermission,
            arkUrl: data.arkUrl,
            properties: this.processLemmaProperties(data)};
        }
      ));
  }

  getListNode(iri: string): Observable<ListNodeV2> {
    return this.knoraApiConnection.v2.listNodeCache.getNode(iri).pipe(
      map(data => data)
    );
  }

  getList(listIri: string): Observable<ListResponse> {
    return this.listAdminCache.getList(listIri).pipe(
      map( (res: ListResponse) => res)
    );
  }

  getResourcesByLabel(val: string, restype?: string): Observable<Array<{ id: string; label: string }>> {
    let params: ILabelSearchParams | undefined;
    if (restype !== undefined) {
      params = {
        limitToResourceClass: restype
      };
    }
    return this.knoraApiConnection.v2.search.doSearchByLabel(val, 0, params).pipe(
      map((data: ReadResourceSequence | ApiResponseError) => {
        if (data instanceof ApiResponseError) {
          return [];
        } else {
          const items: Array<{id: string, label: string}> = data.resources.map((item: ReadResource) => {
            return {id: item.id, label: item.label};
          });
          return items;
        }
      }),
    );
  }

  createArticle(data: ArticleData): Observable<ResourceData> {
    console.log('DATA=', data);
    const createResource = new CreateResource();
    createResource.label = data.label;
    createResource.type = this.mlsOntology + 'Article';
    createResource.attachedToProject = 'http://rdfh.ch/projects/0807';

    const props = {};

    const lemmaVal = new CreateLinkValue();
    lemmaVal.linkedResourceIri = data.lemmaIri;
    props[this.mlsOntology + 'hasALinkToLemmaValue'] = [
      lemmaVal
    ];

    const lexiconVal = new CreateLinkValue();
    lexiconVal.linkedResourceIri = data.lexiconIri;
    props[this.mlsOntology + 'hasALinkToLexiconValue'] = [
      lexiconVal
    ];

    const articleVal = new CreateTextValueAsXml();
    const tmp = data.article.replace('&nbsp;', ' ');
    articleVal.xml = '<?xml version="1.0" encoding="UTF-8"?>\n<text>' + tmp + '</text>';
    articleVal.mapping = 'http://rdfh.ch/standoff/mappings/StandardMapping';
    props[this.mlsOntology + 'hasArticleText'] = [
      articleVal
    ];

    if (data.fonoteca !== null && data.fonoteca !== undefined && data.fonoteca !== '') {
      const fonotecaVal = new CreateTextValueAsString();
      fonotecaVal.text = data.fonoteca;
      props[this.mlsOntology + 'hasFonotecacode'] = [
        fonotecaVal
      ];
    }

    if (data.hls !== null && data.hls !== undefined && data.hls !== '') {
      const hlsVal = new CreateTextValueAsString();
      hlsVal.text = data.hls;
      props[this.mlsOntology + 'hasHlsCcode'] = [
        hlsVal
      ];
    }

    if (data.oem !== null && data.oem !== undefined && data.oem !== '') {
      const oemVal = new CreateTextValueAsString();
      oemVal.text = data.oem;
      props[this.mlsOntology + 'hasOemlCode'] = [
        oemVal
      ];
    }

    if (data.theatre !== null && data.theatre !== undefined && data.theatre !== '') {
      const theatreVal = new CreateTextValueAsString();
      theatreVal.text = data.theatre;
      props[this.mlsOntology + 'hasTheatreLexCode'] = [
        theatreVal
      ];
    }

    if (data.ticino !== null && data.ticino !== undefined && data.ticino !== '') {
      const ticinoVal = new CreateTextValueAsString();
      ticinoVal.text = data.ticino;
      props[this.mlsOntology + 'hasTicinoLexCode'] = [
        ticinoVal
      ];
    }

    if (data.web !== null && data.web !== '') {
      const webVal = new CreateTextValueAsString();
      webVal.text = data.web;
      props[this.mlsOntology + 'hasWebLink'] = [
        webVal
      ];
    }

    console.log(props);
    createResource.properties = props;

    return this.knoraApiConnection.v2.res.createResource(createResource).pipe(
      map((res: ReadResource) => {
          console.log('CREATE_RESOURCE:', res);
          return {
            id: res.id,
            label: res.label,
            permission: res.userHasPermission,
            properties: this.processResourceProperties(res)};
        }
      ));
  }

}

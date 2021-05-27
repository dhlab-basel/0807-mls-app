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
  CreateTextValueAsString,
  UpdateTextValueAsString,
  UpdateResource,
  UpdateValue,
  CreateIntValue,
  CreateValue,
  WriteValueResponse,
  UpdateIntValue,
  ReadIntValue,
  DeleteValue,
  DeleteValueResponse,
  ListsResponse,
  List,
  StringLiteral,
  CreateListRequest,
  CreateListValue,
  UpdateResourceMetadata,
  UpdateResourceMetadataResponse,
  UpdateListValue, UpdateLinkValue
} from '@dasch-swiss/dsp-js';

import {AppInitService} from '../app-init.service';
import {Observable, of} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {GravsearchTemplatesService} from './gravsearch-templates.service';
import {insertAfterLastOccurrence} from '@angular/cdk/schematics';

export class LangString {
  data: {[index: string]: string};

  constructor(langstr: Array<StringLiteral>) {
    this.data = {};
    for (const p of langstr) {
        this.data[p.language || 'de'] = p.value || 'GAGA';
    }
  }

  get(lang: string): string {
    if (lang in this.data) {
      return this.data[lang];
    } else {
      for (const l in this.data) {
        if (this.data.hasOwnProperty(l)) {
          return this.data[l];
        }
      }
    }
    return '-';
  }
}

export class ListData {
  constructor(public listid: string,
              public labels: LangString,
              public name?: string) {
  }
}

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

export class IntPropertyData extends PropertyData {
  public ivalues: Array<number>;

  constructor(propname: string,
              label: string,
              ivalues: Array<number>,
              ids: Array<string>,
              comments: Array<string | undefined>,
              permissions: Array<string>) {
    const values = ivalues.map(x => x.toString(10));
    super(propname, label, values, ids, comments, permissions);
    this.ivalues = ivalues;
  }
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
  lastmod: string; /** last modification date of resource */
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
    public pages?: string,
    public fonoteca?: string,
    public hls?: string,
    public oem?: string,
    public theatre?: string,
    public ticino?: string,
    public web?: string
) {
  }
}

export class LexiconData {
  constructor(
    public label: string,
    public shortname: string, // mls:hasShortname
    public citationForm: string, // mls:hasCitationForm
    public comment: string, // mls:hasLexiconComment
    public year: string, // mls:hasYear
    public weblink?: string, // mls:hasLexiconWeblink
    public library?: string, // mls:hasLibrary
    public libraryIri?: string,
    public scanFinished?: string, // mls:hasScanFinished
    public scanVendor?: string, // mls:hasScanVendor
    public ocrFinished?: string, // mls:hasOCRFinished
    public ocrVendor?: string, // mls:hasOCRVendor
    public editFinished?: string, // mls:hasEditFinished
    public editVendor?: string, // mls:hasEditVendor
  ) {
  }
}

export class Lemma {
  constructor(
    public label: string,
    public text: string, // mls:hasLemmaText: TextValue
    public type: string, // mls:hasLemmaType: ListValue -> hlist:ArticleTyp
    public typeIri: string,
    public givenName: string, // mls:hasGivenName: TextValue
    public familyName: string, // mls:hasFamilyName: TextValue
    public pseudonym: string, // mls:hasPseudonym: TextValue
    public variants: string, // mls:hasVariants: TextValue, ToDo: can have mutiple values -> Array
    public century: string, // mls:hasCentury: TextValue
    public deceased: string, // mls:hasDeceasedValue: ListValue -> hlist:ArtikelTyp
    public deceasedIri: string,
    public startDate: string, // mls:hasStartDate: TextValue: TextValue
    public startDateInfo: string, // mls:hasStartDateInfo: TextValue
    public endDate: string, // mls:hasEndDate: TextValue
    public endDateInfo: string, // mls:hasEndDateInfo: TextValue
    public sex: string, // mls:hasSex
    public sexIri: string,
    public relevance: string, // mls:hasRelevanceValue: ListValue -> hlist:ArticleTyp
    public relevanceIri: string, // mls:hasRelevanceValue: ListValue -> hlist:ArticleTyp
    public gnd: string, // mls:hasGnd: TextValue
    public viaf: string, // mls:hasViaf: TextValue
    public comment: string, // mls:haslemmaComment: TextValue
  ) {

  }
}

export interface OptionType {
  iri: string;
  name: string;
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

  lemmaTypeListIri: string;
  public lemmaTypes: Array<OptionType> = [];
  deceasedTypeListIri: string;
  public deceasedTypes: Array<OptionType> = [];
  sexTypeListIri: string;
  public sexTypes: Array<OptionType> = [];
  relevanceTypeIri: string;
  public relevanceTypes: Array<OptionType> = [];


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

    this.getListTypes();
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
          case Constants.IntValue: {
            const vals = data.getValuesAs(prop, ReadIntValue);
            const label: string = vals[0].propertyLabel || '?';
            const values: Array<number> = vals.map(v => v.int);
            const ids: Array<string> = vals.map(v => v.id);
            const comments: Array<string | undefined> = vals.map(v => v.valueHasComment);
            const permissions: Array<string> = vals.map(v => v.userHasPermission);
            propdata.push(new IntPropertyData(prop, label, values, ids, comments, permissions));
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
    return this.knoraApiConnection.v2.ontologyCache.getOntology(ontoIri).pipe(  // ToDo: Use Cache
      map((cachedata: Map<string, ReadOntology>) => {
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
          resInfo.properties[prop.propertyIndex] = {
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
        }
        return resInfo;
      }, catchError(error => {console.log(error); return error; }))
    );
  }

  getResource(iri: string): Observable<ResourceData> {
    return this.knoraApiConnection.v2.res.getResource(iri).pipe(
      map((data: ReadResource) => {
        return {
          id: data.id,
          label: data.label,
          permission: data.userHasPermission,
          lastmod: data.lastModificationDate || '',
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

  getAllLists(): Observable<Array<ListData>> {
    return this.knoraApiConnection.admin.listsEndpoint.getListsInProject(this.appInitService.getSettings().project).pipe(
      map((res: ApiResponseData<ListsResponse>) => {
        const result: Array<ListData> = [];
        for (const list of res.body.lists) {
          result.push(new ListData(list.id, new LangString(list.labels)));
        }
        return result;
      })
    );
  }

  getFlatList(listIri: string): Observable<Array<ListData>> {
    return this.listAdminCache.getList(listIri).pipe(
      map( (res: ListResponse) => {
        const flatList: Array<ListData> = [];
        for (const child of res.list.children) {
          flatList.push(new ListData(child.id, new LangString(child.labels), child.name));
        }
        return flatList;
      })
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

  createArticle(data: ArticleData): Observable<string> {
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

    const articleVal = new CreateTextValueAsString();
    articleVal.text = data.article;
    props[this.mlsOntology + 'hasArticleText'] = [
      articleVal
    ];

    if (data.pages !== null && data.pages !== undefined && data.pages !== '') {
      const pagesVal = new CreateTextValueAsString();
      pagesVal.text = data.pages;
      props[this.mlsOntology + 'hasPages'] = [
        pagesVal
      ];
    }

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

    if (data.web !== null && data.web !== undefined && data.web !== '') {
      const webVal = new CreateTextValueAsString();
      webVal.text = data.web;
      props[this.mlsOntology + 'hasWebLink'] = [
        webVal
      ];
    }

    createResource.properties = props;

    return this.knoraApiConnection.v2.res.createResource(createResource).pipe(
      map((res: ReadResource) => {
        return res.id;
      }),
      catchError((error: ApiResponseError) => {
        return of('error'); }
      )
    );
  }

  createLemma(data: Lemma): Observable<string> {
    const createResource = new CreateResource();
    createResource.label = data.label;
    createResource.type = this.mlsOntology + 'Lemma';
    createResource.attachedToProject = 'http://rdfh.ch/projects/0807';

    const props = {};

    if (data.text !== null && data.text !== undefined && data.text !== '') {
      const textVal = new CreateTextValueAsString();
      textVal.text = data.text;
      props[this.mlsOntology + 'hasLemmaText'] = [
        textVal
      ];
    }

    if (data.typeIri !== null && data.typeIri !== undefined && data.typeIri !== '') {
      const typeVal = new CreateListValue();
      typeVal.listNode = data.typeIri;
      props[this.mlsOntology + 'hasLemmaType'] = [
        typeVal
      ];
    }

    if (data.givenName !== null && data.givenName !== undefined && data.givenName !== '') {
      const givenNameVal = new CreateTextValueAsString();
      givenNameVal.text = data.givenName;
      props[this.mlsOntology + 'hasGivenName'] = [
        givenNameVal
      ];
    }

    if (data.familyName !== null && data.familyName !== undefined && data.familyName !== '') {
      const familyNameVal = new CreateTextValueAsString();
      familyNameVal.text = data.familyName;
      props[this.mlsOntology + 'hasFamilyName'] = [
        familyNameVal
      ];
    }

    if (data.pseudonym !== null && data.pseudonym !== undefined && data.pseudonym !== '') {
      const pseudonymVal = new CreateTextValueAsString();
      pseudonymVal.text = data.pseudonym;
      props[this.mlsOntology + 'hasPseudonym'] = [
        pseudonymVal
      ];
    }

    if (data.variants !== null && data.variants !== undefined && data.variants !== '') {
      const variantsVal = new CreateTextValueAsString();
      variantsVal.text = data.variants;
      props[this.mlsOntology + 'hasVariants'] = [
        variantsVal
      ];
    }

    if (data.century !== null && data.century !== undefined && data.century !== '') {
      const centuryVal = new CreateTextValueAsString();
      centuryVal.text = data.century;
      props[this.mlsOntology + 'hasCentury'] = [
        centuryVal
      ];
    }

    if (data.deceasedIri !== null && data.deceasedIri !== undefined && data.deceasedIri !== '') {
      const deceasedVal = new CreateListValue();
      deceasedVal.listNode = data.deceasedIri;
      props[this.mlsOntology + 'hasDeceasedValue'] = [
        deceasedVal
      ];
    }

    if (data.startDate !== null && data.startDate !== undefined && data.startDate !== '') {
      const startDateVal = new CreateTextValueAsString();
      startDateVal.text = data.startDate;
      props[this.mlsOntology + 'hasStartDate'] = [
        startDateVal
      ];
    }

    if (data.startDateInfo !== null && data.startDateInfo !== undefined && data.startDateInfo !== '') {
      const startDateInfoVal = new CreateTextValueAsString();
      startDateInfoVal.text = data.startDateInfo;
      props[this.mlsOntology + 'hasStartDateInfo'] = [
        startDateInfoVal
      ];
    }

    if (data.endDate !== null && data.endDate !== undefined && data.endDate !== '') {
      const endDateVal = new CreateTextValueAsString();
      endDateVal.text = data.endDate;
      props[this.mlsOntology + 'hasEndDate'] = [
        endDateVal
      ];
    }

    if (data.endDateInfo !== null && data.endDateInfo !== undefined && data.endDateInfo !== '') {
      const endDateInfoVal = new CreateTextValueAsString();
      endDateInfoVal.text = data.endDateInfo;
      props[this.mlsOntology + 'hasEndDateInfo'] = [
        endDateInfoVal
      ];
    }

    if (data.sexIri !== null && data.sexIri !== undefined && data.sexIri !== '') {
      const sexVal = new CreateListValue();
      sexVal.listNode = data.sexIri;
      props[this.mlsOntology + 'hasSex'] = [
        sexVal
      ];
    }

    if (data.relevanceIri !== null && data.relevanceIri !== undefined && data.relevanceIri !== '') {
      const relevanceVal = new CreateListValue();
      relevanceVal.listNode = data.relevanceIri;
      props[this.mlsOntology + 'hasRelevanceValue'] = [
        relevanceVal
      ];
    }

    if (data.gnd !== null && data.gnd !== undefined && data.gnd !== '') {
      const gndVal = new CreateTextValueAsString();
      gndVal.text = data.gnd;
      props[this.mlsOntology + 'hasGnd'] = [
        gndVal
      ];
    }

    if (data.viaf !== null && data.viaf !== undefined && data.viaf !== '') {
      const viafVal = new CreateTextValueAsString();
      viafVal.text = data.viaf;
      props[this.mlsOntology + 'hasViaf'] = [
        viafVal
      ];
    }

    if (data.comment !== null && data.comment !== undefined && data.comment !== '') {
      const commentVal = new CreateTextValueAsString();
      commentVal.text = data.comment;
      props[this.mlsOntology + 'hasLemmaComment'] = [
        commentVal
      ];
    }

    createResource.properties = props;

    return this.knoraApiConnection.v2.res.createResource(createResource).pipe(
      map((res: ReadResource) => {
        return res.id;
      }),
      catchError((error: ApiResponseError) => {
        return of('error'); }
      )
    );
  }

  createLexicon(data: LexiconData): Observable<string> {
    const createResource = new CreateResource();
    createResource.label = data.label;
    createResource.type = this.mlsOntology + 'Article';
    createResource.attachedToProject = 'http://rdfh.ch/projects/0807';

    const props = {};

    if (data.shortname !== null && data.shortname !== undefined && data.shortname !== '') {
      const shortnameVal = new CreateTextValueAsString();
      shortnameVal.text = data.shortname;
      props[this.mlsOntology + 'hasShortname'] = [
        shortnameVal
      ];
    }

    if (data.citationForm !== null && data.citationForm !== undefined && data.citationForm !== '') {
      const citationFormVal = new CreateTextValueAsString();
      citationFormVal.text = data.citationForm;
      props[this.mlsOntology + 'hasCitationForm'] = [
        citationFormVal
      ];
    }

    if (data.comment !== null && data.comment !== undefined && data.comment !== '') {
      const commentVal = new CreateTextValueAsString();
      commentVal.text = data.comment;
      props[this.mlsOntology + 'hasLexiconComment'] = [
        commentVal
      ];
    }

    if (data.year !== null && data.year !== undefined && data.year !== '') {
      const yearVal = new CreateTextValueAsString();
      yearVal.text = data.year;
      props[this.mlsOntology + 'hasYear'] = [
        yearVal
      ];
    }

    if (data.weblink !== null && data.weblink !== undefined && data.weblink !== '') {
      const weblinkVal = new CreateTextValueAsString();
      weblinkVal.text = data.weblink;
      props[this.mlsOntology + 'hasLexiconWeblink'] = [
        weblinkVal
      ];
    }

    if (data.library !== null && data.library !== undefined &&
        data.library !== '' && data.libraryIri !== undefined) {
      const libraryVal = new CreateLinkValue();
      libraryVal.linkedResourceIri = data.libraryIri;
      props[this.mlsOntology + 'hasLibrary'] = [
        libraryVal
      ];
    }

    if (data.scanFinished !== null && data.scanFinished !== undefined && data.scanFinished !== '') {
      const scanFinishedVal = new CreateTextValueAsString();
      scanFinishedVal.text = data.scanFinished;
      props[this.mlsOntology + 'hasScanFinished'] = [
        scanFinishedVal
      ];
    }

    if (data.scanVendor !== null && data.scanVendor !== undefined && data.scanVendor !== '') {
      const scanVendorVal = new CreateTextValueAsString();
      scanVendorVal.text = data.scanVendor;
      props[this.mlsOntology + 'hasScanVendor'] = [
        scanVendorVal
      ];
    }

    if (data.ocrFinished !== null && data.ocrFinished !== undefined && data.ocrFinished !== '') {
      const ocrFinishedVal = new CreateTextValueAsString();
      ocrFinishedVal.text = data.ocrFinished;
      props[this.mlsOntology + 'hasOCRFinished'] = [
        ocrFinishedVal
      ];
    }

    if (data.ocrVendor !== null && data.ocrVendor !== undefined && data.ocrVendor !== '') {
      const ocrVendorVal = new CreateTextValueAsString();
      ocrVendorVal.text = data.ocrVendor;
      props[this.mlsOntology + 'hasOCRVendor'] = [
        ocrVendorVal
      ];
    }

    if (data.editFinished !== null && data.editFinished !== undefined && data.editFinished !== '') {
      const editFinishedVal = new CreateTextValueAsString();
      editFinishedVal.text = data.editFinished;
      props[this.mlsOntology + 'hasEditFinished'] = [
        editFinishedVal
      ];
    }

    if (data.editVendor !== null && data.editVendor !== undefined && data.editVendor !== '') {
      const editVendorVal = new CreateTextValueAsString();
      editVendorVal.text = data.editVendor;
      props[this.mlsOntology + 'hasEditFinished'] = [
        editVendorVal
      ];
    }

    createResource.properties = props;

    return this.knoraApiConnection.v2.res.createResource(createResource).pipe(
      map((res: ReadResource) => {
        return res.id;
      }),
      catchError((error: ApiResponseError) => {
        return of('error'); }
      )
    );

  }

  /**
   * creates a new text value
   * @param resId Resource id (IRI)
   * @param resType Resource type (IRI)
   * @param property property type (IRI)
   * @param text Text value
   */
  createTextValue(resId: string, resType: string, property: string, text: string): Observable<string> {
    const createTextVal = new CreateTextValueAsString();
    createTextVal.text = text;

    const createResource = new UpdateResource<CreateValue>();
    createResource.id = resId;
    createResource.type = resType;
    createResource.property = property;
    createResource.value = createTextVal;

    return this.knoraApiConnection.v2.values.createValue(createResource).pipe(
      map((res: WriteValueResponse) => {
        return 'OK';
      }),
      catchError((error: ApiResponseError) => {
        return of('ERROR');
      })
    );
  }

  /**
   * Updates a text value
   *
   * @param resId Resource id (IRI)
   * @param resType Resource type (IRI)
   * @param valId Value id (IRI)
   * @param property Property class (IRI)
   * @param text Text value
   */
  updateTextValue(resId: string, resType: string, valId: string, property: string, text: string): Observable<string> {
    const updateTextVal = new UpdateTextValueAsString();
    updateTextVal.id = valId;
    updateTextVal.text = text;

    const updateResource = new UpdateResource<UpdateValue>();
    updateResource.id = resId;
    updateResource.type = resType;
    updateResource.property = property;
    updateResource.value = updateTextVal;

    return this.knoraApiConnection.v2.values.updateValue(updateResource).pipe(
      map((res: WriteValueResponse) => {
        return 'OK';
      }),
      catchError((error: ApiResponseError) => {
        return of('ERROR');
      })
    );
  }

  deleteTextValue(resId: string, resType: string, valId: string, property: string): Observable<string> {
    const deleteVal = new DeleteValue();

    deleteVal.id = valId;
    deleteVal.type = 'http://api.knora.org/ontology/knora-api/v2#TextValue';

    const updateResource = new UpdateResource<DeleteValue>();
    updateResource.id = resId;
    updateResource.type = resType;
    updateResource.property = property;
    updateResource.value = deleteVal;

    return this.knoraApiConnection.v2.values.deleteValue(updateResource).pipe(
      map((res: DeleteValueResponse) => {
        return 'OK';
      }),
      catchError((error: ApiResponseError) => {
        return of('ERROR');
      })
    );
  }

  createLinkValue(resId: string, resType: string, property: string, iri: string): Observable<string> {
    const createLinkVal = new CreateLinkValue();
    createLinkVal.linkedResourceIri = iri;

    const createResource = new UpdateResource<CreateValue>();
    createResource.id = resId;
    createResource.type = resType;
    createResource.property = property;
    createResource.value = createLinkVal;

    return this.knoraApiConnection.v2.values.createValue(createResource).pipe(
      map((res: WriteValueResponse) => {
        return 'OK';
      }),
      catchError((error: ApiResponseError) => {
        return of('ERROR');
      })
    );
  }

  /**
   * Updates a text value
   *
   * @param resId Resource id (IRI)
   * @param resType Resource type (IRI)
   * @param valId Value id (IRI)
   * @param property Property class (IRI)
   * @param text Text value
   */
  updateLinkValue(resId: string, resType: string, valId: string, property: string, iri: string): Observable<string> {
    const updateLinkVal = new UpdateLinkValue();
    updateLinkVal.id = valId;
    updateLinkVal.linkedResourceIri = iri;

    const updateResource = new UpdateResource<UpdateValue>();
    updateResource.id = resId;
    updateResource.type = resType;
    updateResource.property = property;
    updateResource.value = updateLinkVal;

    return this.knoraApiConnection.v2.values.updateValue(updateResource).pipe(
      map((res: WriteValueResponse) => {
        return 'OK';
      }),
      catchError((error: ApiResponseError) => {
        return of('ERROR');
      })
    );
  }

  deleteLinkValue(resId: string, resType: string, valId: string, property: string): Observable<string> {
    const deleteVal = new DeleteValue();

    deleteVal.id = valId;
    deleteVal.type = 'http://api.knora.org/ontology/knora-api/v2#LinkValue';

    const updateResource = new UpdateResource<DeleteValue>();
    updateResource.id = resId;
    updateResource.type = resType;
    updateResource.property = property;
    updateResource.value = deleteVal;

    return this.knoraApiConnection.v2.values.deleteValue(updateResource).pipe(
      map((res: DeleteValueResponse) => {
        return 'OK';
      }),
      catchError((error: ApiResponseError) => {
        return of('ERROR');
      })
    );
  }

  createIntValue(resId: string, resType: string, property: string, ival: number): Observable<string> {
    const createIntVal = new CreateIntValue();
    createIntVal.int = ival;

    const createResource = new UpdateResource<CreateValue>();
    createResource.id = resId;
    createResource.type = resType;
    createResource.property = property;
    createResource.value = createIntVal;

    return this.knoraApiConnection.v2.values.createValue(createResource).pipe(
      map((res: WriteValueResponse) => {
        return 'OK';
      }),
      catchError((error: ApiResponseError) => {
        return of('error');
      })
    );
  }

  updateIntValue(resId: string, resType: string, valId: string, property: string, ival: number): Observable<string> {
    const updateIntVal = new UpdateIntValue();
    updateIntVal.id = valId;
    updateIntVal.int = ival;

    const updateResource = new UpdateResource<UpdateValue>();
    updateResource.id = resId;
    updateResource.type = resType;
    updateResource.property = property;
    updateResource.value = updateIntVal;

    return this.knoraApiConnection.v2.values.updateValue(updateResource).pipe(
      map((res: WriteValueResponse) => {
        return 'OK';
      }),
      catchError((error: ApiResponseError) => {
        return of('error');
      })
    );
  }

  deleteIntValue(resId: string, resType: string, valId: string, property: string): Observable<string> {
    const deleteVal = new DeleteValue();

    deleteVal.id = valId;
    deleteVal.type = 'http://api.knora.org/ontology/knora-api/v2#IntValue';

    const updateResource = new UpdateResource<DeleteValue>();
    updateResource.id = resId;
    updateResource.type = resType;
    updateResource.property = property;
    updateResource.value = deleteVal;

    return this.knoraApiConnection.v2.values.deleteValue(updateResource).pipe(
      map((res: DeleteValueResponse) => {
        return 'OK';
      }),
      catchError((error: ApiResponseError) => {
        return of('ERROR');
      })
    );
  }

  createListValue(resId: string, resType: string, property: string, nodeIri: string): Observable<string> {
    const createListVal = new CreateListValue();
    createListVal.listNode = nodeIri;

    const createResource = new UpdateResource<CreateValue>();
    createResource.id = resId;
    createResource.type = resType;
    createResource.property = property;
    createResource.value = createListVal;

    return this.knoraApiConnection.v2.values.createValue(createResource).pipe(
      map((res: WriteValueResponse) => {
        return 'OK';
      }),
      catchError((error: ApiResponseError) => {
        return of('error');
      })
    );
  }

  updateListValue(resId: string, resType: string, valId: string, property: string, nodeIri: string): Observable<string> {
    const updateListVal = new UpdateListValue();
    updateListVal.id = valId;
    updateListVal.listNode = nodeIri;

    const updateResource = new UpdateResource<UpdateValue>();
    updateResource.id = resId;
    updateResource.type = resType;
    updateResource.property = property;
    updateResource.value = updateListVal;

    return this.knoraApiConnection.v2.values.updateValue(updateResource).pipe(
      map((res: WriteValueResponse) => {
        return 'OK';
      }),
      catchError((error: ApiResponseError) => {
        return of('error');
      })
    );
  }

  deleteListValue(resId: string, resType: string, valId: string, property: string): Observable<string> {
    const deleteVal = new DeleteValue();

    deleteVal.id = valId;
    deleteVal.type = 'http://api.knora.org/ontology/knora-api/v2#ListValue';

    const updateResource = new UpdateResource<DeleteValue>();
    updateResource.id = resId;
    updateResource.type = resType;
    updateResource.property = property;
    updateResource.value = deleteVal;

    return this.knoraApiConnection.v2.values.deleteValue(updateResource).pipe(
      map((res: DeleteValueResponse) => {
        return 'OK';
      }),
      catchError((error: ApiResponseError) => {
        return of('ERROR');
      })
    );
  }

  updateLabel(resId: string, resType: string, lastmod: string, label: string) {
    const updateResourceMetadata = new UpdateResourceMetadata();
    updateResourceMetadata.id = resId;
    updateResourceMetadata.type = resType;
    updateResourceMetadata.lastModificationDate = lastmod;
    updateResourceMetadata.label = label;

    return this.knoraApiConnection.v2.res.updateResourceMetadata(updateResourceMetadata).pipe(
      map((res: UpdateResourceMetadataResponse) => {
        return 'OK';
      }),
      catchError((error: ApiResponseError) => {
        return of('ERROR');
      })
    );
  }

  getListTypes() {
    this.getAllLists().subscribe(
      lists => {
        for (const list of lists) {
          if (list.labels.get('de') === 'Artikeltyp') {
            this.lemmaTypeListIri = list.listid;
            this.getFlatList(list.listid).subscribe(
              (res: Array<ListData>) => {
                for (const lt of res) {
                  this.lemmaTypes.push({iri: lt.listid, name: lt.labels.get('de')});
                }
              }
            );
          }
          if (list.labels.get('de') === 'Verstorben') {
            this.deceasedTypeListIri = list.listid;
            this.getFlatList(list.listid).subscribe(
              (res: Array<ListData>) => {
                for (const lt of res) {
                  this.deceasedTypes.push({iri: lt.listid, name: lt.labels.get('de')});
                }
              }
            );
          }
          if (list.labels.get('de') === 'Geschlecht') {
            this.sexTypeListIri = list.listid;
            this.getFlatList(list.listid).subscribe(
              (res: Array<ListData>) => {
                for (const lt of res) {
                  this.sexTypes.push({iri: lt.listid, name: lt.labels.get('de')});
                }
              }
            );
          }
          if (list.labels.get('de') === 'Relevantes Lemma') {
            this.relevanceTypeIri = list.listid;
            this.getFlatList(list.listid).subscribe(
              (res: Array<ListData>) => {
                for (const lt of res) {
                  this.relevanceTypes.push({iri: lt.listid, name: lt.labels.get('de')});
                }
              }
            );
          }

        }
      }
    );
  }


}

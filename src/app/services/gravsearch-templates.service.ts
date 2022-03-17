import { Injectable } from '@angular/core';
import { SparqlPrep} from '../classes/sparql-prep';

@Injectable({
  providedIn: 'root'
})
/*        ?relval knora-api:listValueAsListNode <http://rdfh.ch/lists/0807/npzA9IfDR12kZXo7oNKMxA> . */
/*        FILTER (?relval = "Ja"^^knora-api:ListNode) . */
/*         ?lemma mls:hasRelevanceValue ?relval . */
export class GravsearchTemplatesService {

  constructor(private sparqlPrep: SparqlPrep) { }

  lemmata_query(params: {[index: string]: string}): string {
    const result = this.sparqlPrep.compile(`
    PREFIX knora-api: <http://api.knora.org/ontology/knora-api/simple/v2#>
    PREFIX mls: <{{ ontology }}/ontology/0807/mls/simple/v2#>
    CONSTRUCT {
        ?lemma knora-api:isMainResource true .
        ?lemma mls:hasLemmaText ?text .
        ?lemma mls:hasFamilyName ?fname .
        ?lemma mls:hasGivenName ?gname .
        ?lemma mls:hasStartDate ?startdate .
        ?lemma mls:hasEndDate ?enddate .
        {{ #if lexicon_iri }}
        ?article mls:hasALinkToLemma ?lemma .
        ?article mls:hasALinkToLexicon ?lexicon .
        ?lexicon mls:hasShortname ?shortname .
        ?lexicon mls:hasCitationForm ?citation .
        {{ #endif }}
    } WHERE {
        {{ #if lexicon_iri }}
        BIND(<{{ lexicon_iri }}> AS ?lexicon)
        ?article a knora-api:Resource .
        ?article a mls:Article .
        ?article mls:hasALinkToLemma ?lemma .
        {{ #endif }}
        ?lemma a knora-api:Resource .
        ?lemma a mls:Lemma .
        ?lemma mls:hasRelevanceValue ?relval .
        ?lemma mls:hasLemmaText ?text .
        FILTER regex(?text, "^{{ start }}", "i")
        ?lemma mls:hasFamilyName ?fname .
        {{ #if lexicon_iri }}
        ?lexicon a knora-api:Resource .
        ?lexicon a mls:Lexicon .
        ?lexicon mls:hasCitationForm ?citation .
        ?article mls:hasALinkToLexicon ?lexicon .
        OPTIONAL { ?lexicon mls:hasShortname ?shortname . }
        {{ #endif }}
        OPTIONAL { ?lemma mls:hasGivenName ?gname . }
        OPTIONAL { ?lemma mls:hasStartDate ?startdate . }
        OPTIONAL { ?lemma mls:hasEndDate ?enddate . }
        FILTER (?relval = "Ja"^^knora-api:ListNode) .
    }
    ORDER BY ASC(?text)
    OFFSET {{ page }}
  `, params);
    return result;
  }
  // FILTER regex(?text, "^{{ start }}", "i")
  // FILTER knora-api:matchText(?text, "{{ start }}*")

  lemmata_search(params: {[index: string]: string}): string {
    const result = this.sparqlPrep.compile(`
    PREFIX knora-api: <http://api.knora.org/ontology/knora-api/simple/v2#>
    PREFIX mls: <{{ ontology }}/ontology/0807/mls/simple/v2#>
    CONSTRUCT {
        ?lemma knora-api:isMainResource true .
        ?lemma mls:hasLemmaText ?text .
        ?lemma mls:hasFamilyName ?fname .
        ?lemma mls:hasGivenName ?gname .
        ?lemma mls:hasStartDate ?startdate .
        ?lemma mls:hasEndDate ?enddate .
        {{ #if lexicon_iri }}
        ?article mls:hasALinkToLemma ?lemma .
        ?article mls:hasALinkToLexicon ?lexicon .
        ?lexicon mls:hasShortname ?shortname .
        ?lexicon mls:hasCitationForm ?citation .
        {{ #endif }}
   } WHERE {
        {{ #if lexicon_iri }}
        BIND(<{{ lexicon_iri }}> AS ?lexicon)
        ?article a knora-api:Resource .
        ?article a mls:Article .
        ?article mls:hasALinkToLemma ?lemma .
        {{ #endif }}
        ?lemma a knora-api:Resource .
        ?lemma a mls:Lemma .
        ?lemma mls:hasLemmaText ?text .
        {{ #if lexicon_iri }}
        ?lexicon a knora-api:Resource .
        ?lexicon a mls:Lexicon .
        ?lexicon mls:hasCitationForm ?citation .
        ?article mls:hasALinkToLexicon ?lexicon .
        OPTIONAL { ?lexicon mls:hasShortname ?shortname . }
        {{ #endif }}
        {{ #if searchterm }}
        {
          ?lemma mls:hasPseudonym ?pseudo .
          FILTER knora-api:matchText(?pseudo, "{{ searchterm }}") .
        } UNION {
          ?lemma mls:hasLemmaText ?text .
          FILTER knora-api:matchText(?text, "{{ searchterm }}") .
        } UNION {
          ?lemma mls:hasVariants ?variant .
          FILTER knora-api:matchText(?variant, "{{ searchterm }}") .
        }
        {{ #endif }}
        OPTIONAL { ?lemma mls:hasStartDate ?startdate . }
        OPTIONAL { ?lemma mls:hasEndDate ?enddate . }
        OPTIONAL { ?lemma mls:hasFamilyName ?fname . }
        OPTIONAL { ?lemma mls:hasGivenName ?gname . }
    }
    ORDER BY ASC(?text)
    OFFSET {{ page }}
  `, params);

    return result;
  }

  lexica_query(params: {[index: string]: string}): string {
    const result = this.sparqlPrep.compile(`
    PREFIX knora-api: <http://api.knora.org/ontology/knora-api/simple/v2#>
    PREFIX mls: <{{ ontology }}/ontology/0807/mls/simple/v2#>
    CONSTRUCT {
        ?lexicon knora-api:isMainResource true .
        ?lexicon mls:hasCitationForm ?text .
        ?lexicon mls:hasYear ?year .
        ?lexicon mls:hasLexiconComment ?comment .
        ?lexicon mls:hasLexiconWeblink ?weblink .
        ?lexicon mls:hasShortname ?shortname .
    } WHERE {
        ?lexicon a knora-api:Resource .
        ?lexicon a mls:Lexicon .
        ?lexicon mls:hasCitationForm ?text .
        OPTIONAL { ?lexicon mls:hasYear ?year . }
        OPTIONAL { ?lexicon mls:hasLexiconComment ?comment . }
        OPTIONAL { ?lexicon mls:hasLexiconWeblink ?weblink . }
        OPTIONAL { ?lexicon mls:hasShortname ?shortname . }
    }
    ORDER BY ASC(?year)
    OFFSET {{ page }}
  `, params);
    return result;
  }

  /**
   * Query all lexica that are referenced by a given lemma
   *
   * @param params ontology, lemma_iri [, lexicon_iri]
   */
  /*
  lexica_from_lemma_query(params: {[index: string]: string}): string {
    const result = this.sparqlPrep.compile(`
    PREFIX knora-api: <http://api.knora.org/ontology/knora-api/simple/v2#>
    PREFIX mls: <{{ ontology }}/ontology/0807/mls/simple/v2#>
    CONSTRUCT {
        ?lexicon knora-api:isMainResource true .
        ?article mls:hasALinkToLemma ?lemma .
        ?lemma mls:hasLemmaText ?text .
        ?article mls:hasALinkToLexicon ?lexicon .
        ?article mls:hasArticleText ?arttext .
        ?lexicon mls:hasShortname ?shortname .
        ?lexicon mls:hasCitationForm ?citation .
        ?lexicon mls:hasYear ?year.
    } WHERE {
        BIND(<{{ lemma_iri }}> AS ?lemma)
        {{ #if lexicon_iri }}
        BIND(<{{ lexicon_iri }}> AS ?lexicon)
        {{ #endif }}
        ?lemma a mls:Lemma .
        ?article a mls:Article .
        ?article mls:hasALinkToLemma ?lemma .
        ?lexicon a mls:Lexicon .
        ?article mls:hasALinkToLexicon ?lexicon .
        ?lemma mls:hasLemmaText ?text .
        OPTIONAL { ?article mls:hasArticleText ?arttext . }
        OPTIONAL { ?lexicon mls:hasShortname ?shortname . }
        OPTIONAL { ?lexicon mls:hasCitationForm ?citation . }
        OPTIONAL { ?lexicon mls:hasYear ?year . }
    }
    ORDER BY ASC(?year)
  `, params);
    return result;
  }
*/
  lexica_from_lemma_query(params: {[index: string]: string}): string {
    const result = this.sparqlPrep.compile(`
    PREFIX knora-api: <http://api.knora.org/ontology/knora-api/simple/v2#>
    PREFIX mls: <{{ ontology }}/ontology/0807/mls/simple/v2#>
    CONSTRUCT {
        ?lexicon knora-api:isMainResource true .
        ?article mls:hasALinkToLemma ?lemma .
        ?lemma mls:hasLemmaText ?text .
        ?article mls:hasALinkToLexicon ?lexicon .
        ?article mls:hasArticleText ?arttext .
        ?lexicon mls:hasShortname ?shortname .
        ?lexicon mls:hasCitationForm ?citation .
        ?lexicon mls:hasYear ?year.
    } WHERE {
        BIND(<{{ lemma_iri }}> AS ?lemma)
        {{ #if lexicon_iri }}
        BIND(<{{ lexicon_iri }}> AS ?lexicon)
        {{ #endif }}
        ?lemma a mls:Lemma .
        ?article a mls:Article .
        ?article mls:hasALinkToLemma ?lemma .
        ?lexicon a mls:Lexicon .
        ?article mls:hasALinkToLexicon ?lexicon .
        ?lemma mls:hasLemmaText ?text .
        OPTIONAL { ?article mls:hasArticleText ?arttext . }
        OPTIONAL { ?lexicon mls:hasShortname ?shortname . }
        OPTIONAL { ?lexicon mls:hasCitationForm ?citation . }
        OPTIONAL { ?lexicon mls:hasYear ?year . }
    }
    ORDER BY DESC(?year)
  `, params);
    return result;
  }

  newsitem_search(params: {[index: string]: string}): string {
    const result = this.sparqlPrep.compile(`
    PREFIX knora-api: <http://api.knora.org/ontology/knora-api/simple/v2#>
    PREFIX mls: <{{ ontology }}/ontology/0807/mls/simple/v2#>
    CONSTRUCT {
        ?newsitem knora-api:isMainResource true .
        ?newsitem mls:hasNewsTitle ?title .
        ?newsitem knora-api:hasStillImageFileValue ?image .
        ?newsitem mls:hasNewsText ?text .
        ?newsitem mls:hasNewsitemLinkToLemma ?lemma .
        ?newsitem mls:hasNewsitemWeblink ?weblink .
        ?newsitem mls:hasNewitemActiveDate ?date .
    } WHERE {
        ?newsitem a knora-api:Resource .
        ?newsitem a mls:Newsitem .
        ?newsitem mls:hasNewsTitle ?title .
        ?newsitem knora-api:hasStillImageFileValue ?image .
        ?newsitem mls:hasNewsText ?text .
        ?newsitem mls:hasNewitemActiveDate ?date .
        {{ #if today }}
        FILTER(?date = "{{ today }}"^^knora-api:Date) .
        {{ #endif }}
        OPTIONAL { ?newsitem mls:hasNewsitemLinkToLemma ?lemma . }
        OPTIONAL { ?newsitem mls:hasNewsitemWeblink ?weblink . }
    } ORDER BY ?date
    `, params);
    return result;
  }
}

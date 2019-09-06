import { Injectable } from '@angular/core';
import { SparqlPrep} from '../classes/sparql-prep';

@Injectable({
  providedIn: 'root'
})

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
        ?lemma mls:hasLemmaText ?text .
        ?lemma mls:hasFamilyName ?fname .
        ?lemma mls:hasGivenName ?gname .
        {{ #if lexicon_iri }}
        ?lexicon a knora-api:Resource .
        ?lexicon a mls:Lexicon .
        ?lexicon mls:hasCitationForm ?citation .
        ?article mls:hasALinkToLexicon ?lexicon .
        OPTIONAL { ?lexicon mls:hasShortname ?shortname . }
        {{ #endif }}
        OPTIONAL { ?lemma mls:hasStartDate ?startdate . }
        OPTIONAL { ?lemma mls:hasEndDate ?enddate . }
        FILTER regex(?text, "^{{ start }}", "i")
    }
    ORDER BY ASC(?text)
    OFFSET {{ page }}
  `, params);

    return result;
  }

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
        {
          ?lemma mls:hasPseudonym ?pseudo .
          FILTER regex(?pseudo, "{{ searchterm }}", "i") .
        } UNION {
            FILTER regex(?text, "{{ searchterm }}", "i") .
        } UNION {
          ?lemma mls:hasVariants ?variant .
          FILTER regex(?variant, "{{ searchterm }}", "i") .
        }
        OPTIONAL { ?lemma mls:hasStartDate ?startdate . }
        OPTIONAL { ?lemma mls:hasEndDate ?enddate . }
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
    ORDER BY ASC(?text)
    OFFSET {{ page }}
  `, params);
    return result;
  }
}

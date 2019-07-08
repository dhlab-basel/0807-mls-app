// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  server: 'https://api.02.unibas.dasch.swiss',
  ontologyPrefix: 'http://api.02.unibas.dasch.swiss'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
/*
PREFIX knora-api: c
PREFIX mls: <http://api.02.unibas.dasch.swiss/ontology/0807/mls/simple/v2#>
CONSTRUCT { ?lemma knora-api:isMainResource true . ?lemma mls:hasLemmaText ?text . ?lemma mls:hasFamilyName ?fname . ?lemma mls:hasGivenName ?gname . ?lemma mls:hasStartDate ?startdate . ?lemma mls:hasEndDate ?enddate .  } WHERE {  ?lemma a knora-api:Resource . ?lemma a mls:Lemma . ?lemma mls:hasLemmaText ?text . ?lemma mls:hasFamilyName ?fname . ?lemma mls:hasGivenName ?gname .  OPTIONAL { ?lemma mls:hasStartDate ?startdate . } OPTIONAL { ?lemma mls:hasEndDate ?enddate . } FILTER regex(?text, "^A", "i") } ORDER BY ASC(?text) OFFSET 0
 */

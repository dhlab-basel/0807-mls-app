import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {KnoraApiService} from '../../services/knora-api.service';
import {KnoraResource} from 'knora-jsonld-simplify/dist';
import { Router} from '@angular/router';

@Component({
  selector: 'app-lex-from-lemma',
  template: `
    <p>
      lex-from-lemma works! {{ lemmaIri }}
    </p>
    <table mat-table [dataSource]="lexica">
        <ng-container matColumnDef="lexicon_shortname">
            <th mat-header-cell *matHeaderCellDef> Kürzel </th>
            <td mat-cell *matCellDef="let element"> {{element.lexicon_shortname}} </td>
        </ng-container>
        <ng-container matColumnDef="lexicon_citation">
            <th mat-header-cell *matHeaderCellDef> Zitierform </th>
            <td mat-cell *matCellDef="let element"> {{element.lexicon_citation}} </td>
        </ng-container>
        <ng-container matColumnDef="lexicon_year">
            <th mat-header-cell *matHeaderCellDef> Jahr </th>
            <td mat-cell *matCellDef="let element"> {{element.lexicon_year}} </td>
        </ng-container>
        <tr mat-header-row *matHeaderRowDef="columnsToDisplay"></tr>
        <tr mat-row *matRowDef="let row; columns: columnsToDisplay;" (click)="articleSelected(row)"></tr>
    </table>
  `,
  styles: [
    'td.mat-cell {padding-left: 10px; padding-right:20px;}',
    'tr.mat-row {height: 24px;}',
    '.clickable {cursor: pointer;}'
  ]
})

export class LexFromLemmaComponent implements OnInit {
  @Input()
  lexiconIri: string;
  @Input()
  lemmaIri: string;
  private lexica: Array<{[index: string]: string}> = [];
  private columnsToDisplay: Array<string> = ['lexicon_shortname', 'lexicon_citation', 'lexicon_year'];

  constructor(private route: ActivatedRoute,
              private knoraApiService: KnoraApiService,
              private router: Router) {

  }

  articleSelected(event) {
    const url = 'article/' + encodeURIComponent(event.article_iri);
    this.router.navigateByUrl(url).then(e => {
      if (e) {
        console.log("Navigation is successful!");
      } else {
        console.log("Navigation has failed!");
      }
    });
  }

  getLexsFromLemma() {
    const param = {
      lemma_iri: this.lemmaIri
    };
    this.knoraApiService.gravsearchQuery('lexica_from_lemma_query', param)
      .subscribe((data: Array<KnoraResource>) => {
        console.log(data);
        this.lexica = data.map((x) => {
          const lexiconCitation = x ? x.getValue('mls:hasCitationForm') : undefined;
          const lexiconYear = x ? x.getValue('mls:hasYear') : undefined;
          const lexiconShortname = x ? x.getValue('mls:hasShortname') : undefined;
          const article = x ? x.getResource('hasIncomingLinks') : undefined;
          return {
            lexicon_citation: lexiconCitation ? lexiconCitation.strval : '?',
            lexicon_year: lexiconYear ? lexiconYear.strval : '?',
            lexicon_shortname: lexiconShortname ? lexiconShortname.strval : '?',
            article_iri: article ? article.iri : 'http://NULL'
          };
        });

      });
  }

  ngOnInit() {
    this.getLexsFromLemma();
  }

}

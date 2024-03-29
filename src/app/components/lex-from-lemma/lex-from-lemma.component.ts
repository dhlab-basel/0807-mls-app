import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import { Router} from '@angular/router';
import {KnoraService} from '../../services/knora.service';
import {Constants} from '@dasch-swiss/dsp-js';

@Component({
  selector: 'app-lex-from-lemma',
  template: `
    <h3>Im MLS 2020</h3>
    <table mat-table [dataSource]="mls">
      <ng-container matColumnDef="lexicon_shortname">
        <th mat-header-cell *matHeaderCellDef> Kürzel </th>
        <td mat-cell *matCellDef="let element"> {{element[1]}} </td>
      </ng-container>
      <ng-container matColumnDef="lexicon_citation">
        <th mat-header-cell *matHeaderCellDef> Zitierform </th>
        <td mat-cell *matCellDef="let element"> {{element[2]}} </td>
      </ng-container>
      <ng-container matColumnDef="lexicon_year">
        <th mat-header-cell *matHeaderCellDef> Jahr </th>
        <td mat-cell *matCellDef="let element"> {{element[3]}} </td>
      </ng-container>
      <tr mat-header-row *matHeaderRowDef="columnsToDisplay"></tr>
      <tr mat-row *matRowDef="let row; columns: columnsToDisplay;" (click)="articleSelected(row)" class="clickable"></tr>
    </table>
    <h3>In anderen Lexika</h3>
    <table mat-table [dataSource]="lexica">
        <ng-container matColumnDef="lexicon_shortname">
            <th mat-header-cell *matHeaderCellDef> Kürzel </th>
            <td mat-cell *matCellDef="let element"> {{element[1]}} </td>
        </ng-container>
        <ng-container matColumnDef="lexicon_citation">
            <th mat-header-cell *matHeaderCellDef> Zitierform </th>
            <td mat-cell *matCellDef="let element"> {{element[2]}} </td>
        </ng-container>
        <ng-container matColumnDef="lexicon_year">
            <th mat-header-cell *matHeaderCellDef> Jahr </th>
            <td mat-cell *matCellDef="let element"> {{element[3]}} </td>
        </ng-container>
        <tr mat-header-row *matHeaderRowDef="columnsToDisplay"></tr>
        <tr mat-row *matRowDef="let row; columns: columnsToDisplay;" (click)="articleSelected(row)" class="clickable"></tr>
    </table>
  `,
  styles: [
    'td.mat-cell {padding-left: 10px; padding-right:20px;}',
    'tr.mat-row {height: 24px;}',
    '.clickable {cursor: pointer;}'
  ]
})

export class LexFromLemmaComponent implements OnInit, OnChanges {
  @Input()
  lexiconIri: string;
  @Input()
  lemmaIri: string;
  lexica: Array<Array<string>> = [];
  mls: Array<Array<string>> = [];
  columnsToDisplay: Array<string> = ['lexicon_shortname', 'lexicon_citation', 'lexicon_year'];

  constructor(private route: ActivatedRoute,
              private knoraService: KnoraService,
              private router: Router) {
  }

  articleSelected(event) {
    const url = 'article/' + encodeURIComponent(event[4]);
    this.router.navigateByUrl(url).then(e => {
      if (e) {
        console.log('Navigation is successful!');
      } else {
        console.log('Navigation has failed!');
      }
    });
  }

  getLexsFromLemma() {
    const param = {
      lemma_iri: this.lemmaIri
    };
    const fields: Array<string> = [
      'id',
      this.knoraService.mlsOntology + 'hasShortname',
      this.knoraService.mlsOntology + 'hasCitationForm',
      this.knoraService.mlsOntology + 'hasYear',
      Constants.KnoraApiV2 + Constants.HashDelimiter + 'hasIncomingLinkValue'
    ];
    this.knoraService.gravsearchQuery('lexica_from_lemma_query', param, fields).subscribe(
      (data) => {
        this.lexica = data.filter(v => {if ((v[1] !== 'MLS Online 2020') && (v[1] !== 'MLS Online')){ return v; }});
        this.mls = data.filter(v => {if ((v[1] === 'MLS Online 2020') || (v[1] === 'MLS Online')) { return v; }});
      }
    );
  }

  ngOnInit() {
    this.getLexsFromLemma();
  }

  ngOnChanges() {
    console.log('ngOnChanges: ', this.lemmaIri);
    this.getLexsFromLemma();
  }

}

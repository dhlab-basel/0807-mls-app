import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { GravsearchTemplatesService} from '../../services//gravsearch-templates.service';
import { KnoraJsonldSimplify, KnoraResource, KnoraValue } from 'knora-jsonld-simplify';
import { KnoraApiService} from '../../services/knora-api.service';
import { map } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-lexica',
  template: `
    <mat-card>
        <mat-card-title>
            Lexika
        </mat-card-title>
        <mat-card-content>
            <mat-progress-bar mode="indeterminate" *ngIf="showProgbar"></mat-progress-bar>
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
                <tr mat-row *matRowDef="let row; columns: columnsToDisplay;" (click)="lexiconSelected(row)"></tr>
            </table>
            
            <mat-paginator *ngIf="nLexica > 25" [length]="nLexica"
                           [pageIndex]="page"
                           [pageSize]="25"
                           [pageSizeOptions]="[25]"
                           (page)="pageChanged($event)">
            </mat-paginator>


        </mat-card-content>
    </mat-card>
  `,
  styles: [
    'td.mat-cell {padding-left: 10px; padding-right:20px;}',
    'tr.mat-row {height: 24px;}',
    '.clickable {cursor: pointer;}'
  ]
})
export class LexicaComponent implements OnInit {
  @ViewChild('searchField', {static: false})
  private searchField: ElementRef;

  private lexica: Array<{[index: string]: string}> = [];
  private startchar: string;
  private page: number;
  private nLexica: number;
  private columnsToDisplay: Array<string> = ['lexicon_shortname', 'lexicon_citation', 'lexicon_year'];
  private showProgbar = false;
  private searchterm: string;

  constructor(private knoraApiService: KnoraApiService,
              private activatedRoute: ActivatedRoute,
              private elementRef: ElementRef,
              private router: Router) {
    this.startchar = 'A';
    this.page = 0;
    this.searchterm = '';
    this.activatedRoute.queryParams.subscribe(params => {
      this.startchar = params.hasOwnProperty('startchar') ? params.startchar : 'A';
      console.log(this.startchar); // Print the parameter to the console.
    });

  }

  lexiconSelected(event): void {
    const url = 'lexicon/' + encodeURIComponent(event.lexicon_iri);
    this.router.navigateByUrl(url).then(e => {
      if (e) {
        console.log("Navigation is successful!");
      } else {
        console.log("Navigation has failed!");
      }
    });
  }

  pageChanged(event): void {
    this.page = event.pageIndex;
    this.router.navigate(
      [],
      {
        relativeTo: this.activatedRoute,
        queryParams: {page: this.page},
        queryParamsHandling: "merge", // remove to replace all query params by provided
      });
    this.getLexica();
  }


  getLexica(): void {
    this.showProgbar = true;
    this.lexica = [];

    const params_cnt = {
      page: '0',
      start: this.startchar
    };
    this.knoraApiService.gravsearchQueryCount('lexica_query', params_cnt)
      .subscribe(n => (this.nLexica = Number(n)));
    const params = {
      page: String(this.page),
      start: this.startchar
    };
    this.knoraApiService.gravsearchQuery('lexica_query', params)
      .subscribe((data: Array<KnoraResource>) => {
        this.lexica = data.map((x) => {
          const lexiconCitation = x ? x.getValue('mls:hasCitationForm') : undefined;
          const lexiconYear = x ? x.getValue('mls:hasYear') : undefined;
          const lexiconShortname = x ? x.getValue('mls:hasShortname') : undefined;
          const lexiconComment = x ? x.getValue('mls:hasLexiconComment') : undefined;
          const lexiconWeblink = x ? x.getValue('mls:hasLexiconWeblink') : undefined;
          const lexiconLibrary = x ? x.getValue('mls:hasLibrary') : undefined;
          const lexiconIri = x ? x.iri : undefined;
          this.showProgbar = false;
          return {
            lexicon_citation: lexiconCitation ? lexiconCitation.strval : '?',
            lexicon_year: lexiconYear ? lexiconYear.strval : '?',
            lexicon_shortname: lexiconShortname ? lexiconShortname.strval : '?',
            lexicon_comment: lexiconComment ? lexiconComment.strval : '?',
            lexicon_weblink: lexiconWeblink ? lexiconWeblink.strval : '?',
            lexicon_library: lexiconLibrary ? lexiconLibrary.strval : '?',
            lexicon_iri: lexiconIri ? lexiconIri : 'http://NULL'
          };
        });
      });
  }

  ngOnInit() {
    this.getLexica();
  }

}

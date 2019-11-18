import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {KnoraService} from "../../services/knora.service";

@Component({
  selector: 'app-lexica',
  template: `
    <mat-card>
        <mat-card-title>
          Für das MLS ausgewertete Lexika
        </mat-card-title>
        <mat-card-content>
            <mat-progress-bar mode="indeterminate" *ngIf="showProgbar"></mat-progress-bar>
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
                <tr mat-row *matRowDef="let row; columns: columnsToDisplay;" (click)="lexiconSelected(row)" class="clickable"></tr>
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
  searchField: ElementRef;

  lexica: Array<Array<string>> = [];
  startchar: string;
  page: number;
  nLexica: number;
  columnsToDisplay: Array<string> = ['lexicon_shortname', 'lexicon_citation', 'lexicon_year'];
  showProgbar = false;
  searchterm: string;

  constructor(private knoraService: KnoraService,
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
    const url = '/lemmata';
    this.router.navigate(['/lemmata'], {
      queryParams: {lexicon_iri: event[0]}
    }).then(e => {
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

    const paramsCnt = {
      page: '0',
      start: this.startchar
    };
    this.knoraService.gravsearchQueryCount('lexica_query', paramsCnt).subscribe(
      n => this.nLexica = n
    );
    const params = {
      page: String(this.page),
      start: this.startchar
    };
    const fields: Array<string> = [
      'id',
      this.knoraService.mlsOntology + 'hasShortname',
      this.knoraService.mlsOntology + 'hasCitationForm',
      this.knoraService.mlsOntology + 'hasYear'
    ];
    this.knoraService.gravsearchQuery('lexica_query', params, fields)
      .subscribe(data => {
        this.lexica = data;
        this.showProgbar = false;
      });
  }

  ngOnInit() {
    this.getLexica();
  }

}

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ElementRef, ViewChild } from '@angular/core';
import { Router} from '@angular/router';
import {KnoraService} from "../../services/knora.service";

@Component({
  selector: 'app-lemmata',
  template: `
    <mat-card *ngIf="lexicon_iri">
        <app-lexicon [lexiconIri]="lexicon_iri"></app-lexicon>
    </mat-card>
    <mat-card>
      <mat-card-title>
        Stichworte
      </mat-card-title>
      <mat-card-content>
        <form (submit)="searchEvent($event)" (keyup.enter)="searchEvent($event)">
          <mat-form-field>
            <input #searchField
                   name="searchterm"
                   [value]="searchterm"
                   matInput
                   type="search"
                   placeholder="Stichwortsuche" />
            <mat-icon matSuffix class="clickable" (click)="searchEvent($event)">search</mat-icon>
            <mat-icon matSuffix class="clickable" (click)="searchCancel($event)">cancel</mat-icon>
            <mat-hint>Suche</mat-hint>
          </mat-form-field>
        </form>
        <app-aindex *ngIf="showAindex" [activeChar]="startchar" (charChange)='charChanged($event)'></app-aindex>
        <mat-progress-bar mode="indeterminate" *ngIf="showProgbar"></mat-progress-bar>
        <table mat-table [dataSource]="lemmata">
          <ng-container matColumnDef="lemma_text">
            <th mat-header-cell *matHeaderCellDef> Stichwort </th>
            <td mat-cell *matCellDef="let element"> {{element[1]}} </td>
          </ng-container>
          <ng-container matColumnDef="lemma_start">
            <th mat-header-cell *matHeaderCellDef> Von </th>
            <td mat-cell *matCellDef="let element"> {{element[2]}} </td>
          </ng-container>
          <ng-container matColumnDef="lemma_end">
            <th mat-header-cell *matHeaderCellDef> Bis </th>
            <td mat-cell *matCellDef="let element"> {{element[3]}} </td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="columnsToDisplay"></tr>
          <tr mat-row *matRowDef="let row; columns: columnsToDisplay;" (click)="lemmaSelected(row)" class="clickable"></tr>
        </table>

        <mat-paginator *ngIf="nLemmata > 25" [length]="nLemmata"
                       [pageIndex]="page"
                       [pageSize]="25"
                       [pageSizeOptions]="[25]"
                       (page)="pageChanged($event)" showFirstLastButtons>
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

export class LemmataComponent implements OnInit {
  @ViewChild('searchField', {static: false})
  private searchField: ElementRef;

  lemmata: Array<Array<string>> = [];
  startchar: string;
  page: number;
  nLemmata: number;
  columnsToDisplay: Array<string> = ['lemma_text', 'lemma_start', 'lemma_end'];
  showProgbar: boolean = false;
  showAindex: boolean = true;
  searchterm: string;
  lexicon_iri?: string;

  constructor(private knoraService: KnoraService,
              private activatedRoute: ActivatedRoute,
              private elementRef: ElementRef,
              private router: Router) {
    this.startchar = 'A';
    this.page = 0;
    this.searchterm = '';
    this.activatedRoute.queryParams.subscribe(params => {
      this.startchar = params.hasOwnProperty('startchar') ? params.startchar : 'A';
      this.lexicon_iri = params.hasOwnProperty('lexicon_iri') ? params.lexicon_iri : undefined;
    });
  }

  charChanged(c: string): void {
    this.startchar = c;
    this.page = 0;
    this.router.navigate(
      [],
      {
        relativeTo: this.activatedRoute,
        queryParams: {page: this.page, startchar: this.startchar},
        queryParamsHandling: "merge", // remove to replace all query params by provided
      });
    console.log(c);
    this.getLemmata();
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
    if (this.searchterm === '' && this.lexicon_iri === undefined) {
      this.getLemmata();
    } else {
      this.searchLemmata();
    }
  }

  lemmaSelected(event): void {
    const url = 'lemma/' + encodeURIComponent(event[0]);
    this.router.navigateByUrl(url).then(e => {
      if (e) {
        console.log("Navigation is successful!");
      } else {
        console.log("Navigation has failed!");
      }
    });
  }

  getLemmata(): void {
    this.showProgbar = true;
    this.lemmata = [];
    const paramsCnt = {
      page: '0',
      start: this.startchar
    };

    this.knoraService.gravsearchQueryCount('lemmata_query', paramsCnt).subscribe(
      n => this.nLemmata = n
    );
    const params = {
      page: String(this.page),
      start: this.startchar
    };
    const fields: Array<string> = [
      'id',
      this.knoraService.mlsOntology + 'hasLemmaText',
      this.knoraService.mlsOntology + 'hasStartDate',
      this.knoraService.mlsOntology + 'hasEndDate'
    ];

    this.knoraService.gravsearchQuery('lemmata_query', params, fields)
      .subscribe(data => {
        this.lemmata = data;
        this.showProgbar = false;
      });
  }

  searchLemmata(): void {
    this.showProgbar = true;
    this.showAindex = false;
    this.lemmata = [];

    const paramsCnt: {[index: string]: string} = {
      page: '0',
      searchterm: this.searchterm
    };
    if (this.lexicon_iri !== undefined) {
      paramsCnt.lexicon_iri = this.lexicon_iri;
    }
    this.knoraService.gravsearchQueryCount('lemmata_search', paramsCnt).subscribe(
      n => this.nLemmata = n
    );

    const params: {[index: string]: string} = {
      page: String(this.page),
      searchterm: this.searchterm
    };
    if (this.lexicon_iri !== undefined) {
      params.lexicon_iri = this.lexicon_iri;
    }

    const fields: Array<string> = [
      'id',
      this.knoraService.mlsOntology + 'hasLemmaText',
      this.knoraService.mlsOntology + 'hasStartDate',
      this.knoraService.mlsOntology + 'hasEndDate'
    ];
    this.knoraService.gravsearchQuery('lemmata_search', params, fields)
      .subscribe(data => {
        this.lemmata = data;
        this.showProgbar = false;
      });
  }

  searchEvent(event): boolean {
    this.searchterm = this.searchField.nativeElement.value;
    this.page = 0;
    this.searchLemmata();
    return false;
  }

  searchCancel(event): void {
    this.searchterm = '';
    this.showAindex = true;
    this.getLemmata();
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params.hasOwnProperty('searchterm')) {
        this.searchterm = params.searchterm;
      } else if (params.hasOwnProperty('startchar')) {
        this.startchar = params.hasOwnProperty('startchar') ? params.startchar : 'A';
      } else if (params.hasOwnProperty('page')) {
        this.page = Number(params.hasOwnProperty('startchar'));
      }
      if (this.searchterm !== '' || this.lexicon_iri !== undefined) {
        this.page = 0;
        this.searchLemmata();
      } else {
        this.getLemmata();
      }
    });
  }

}

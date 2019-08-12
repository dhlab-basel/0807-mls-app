import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GetLemmataService } from '../../services/get-lemmata.service';
import { KnoraResource, KnoraValue } from 'knora-jsonld-simplify';
import { ActivatedRoute } from '@angular/router';
import { ElementRef, ViewChild } from '@angular/core';
import { Router} from '@angular/router';

@Component({
  selector: 'app-lemmata',
  template: `
    <mat-card>
      <mat-card-title>
        Lemmata
      </mat-card-title>
      <mat-card-content>
        <form (submit)="searchEvent($event)">
          <mat-form-field>
            <input #searchField name="searchterm" [value]="searchterm" matInput type="search" placeholder="Suchbegriff für Lemma" />
            <mat-icon matSuffix class="clickable" (click)="searchEvent($event)">search</mat-icon>
            <mat-icon matSuffix class="clickable" (click)="searchCancel($event)">cancel</mat-icon>
            <mat-hint>Suche in Lemma, Pseudonyms etc.</mat-hint>
          </mat-form-field>
        </form>
        <app-aindex *ngIf="showAindex" [activeChar]="startchar" (charChange)='charChanged($event)'></app-aindex>
        <mat-progress-bar mode="indeterminate" *ngIf="showProgbar"></mat-progress-bar>
        <table mat-table [dataSource]="lemmata">
          <ng-container matColumnDef="lemma_text">
            <th mat-header-cell *matHeaderCellDef> Lemma </th>
            <td mat-cell *matCellDef="let element"> {{element.lemma_text}} </td>
          </ng-container>
          <ng-container matColumnDef="lemma_start">
            <th mat-header-cell *matHeaderCellDef> Start </th>
            <td mat-cell *matCellDef="let element"> {{element.lemma_start}} </td>
          </ng-container>
          <ng-container matColumnDef="lemma_end">
            <th mat-header-cell *matHeaderCellDef> End </th>
            <td mat-cell *matCellDef="let element"> {{element.lemma_end}} </td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="columnsToDisplay"></tr>
          <tr mat-row *matRowDef="let row; columns: columnsToDisplay;" (click)="lemmaSelected(row)"></tr>
        </table>

        <mat-paginator [length]="nLemmata"
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

export class LemmataComponent implements OnInit {
  @ViewChild('searchField', {static: false})
  private searchField: ElementRef;

  private lemmata: Array<{[index: string]: string}> = [];
  private startchar: string;
  private page: number;
  private nLemmata: number;
  private columnsToDisplay: Array<string> = ['lemma_text', 'lemma_start', 'lemma_end'];
  private showProgbar:boolean = false;
  private showAindex: boolean = true;
  private searchterm: string;

  constructor(private getLemmataService: GetLemmataService,
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
    if (this.searchterm === '') {
      this.getLemmata();
    } else {
      this.searchLemmata();
    }
  }

  lemmaSelected(event): void {
    const url = 'lemma/' + encodeURIComponent(event.lemma_iri);
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
    this.getLemmataService.get_lemmata_count(this.startchar)
      .subscribe(n => (this.nLemmata = Number(n)));
    this.getLemmataService.get_lemmata(this.page, this.startchar)
      .subscribe((data: Array<KnoraResource>) => {
        this.lemmata = data.map((x) => {
          const lemmaText = x ? x.getValue('mls:hasLemmaText') : undefined;
          const lemmaStart = x ? x.getValue('mls:hasStartDate') : undefined;
          const lemmaEnd = x ? x.getValue('mls:hasEndDate') : undefined;
          const lemmaIri = x ? x.iri : undefined;
          this.showProgbar = false;
          return {
            lemma_text: lemmaText ? lemmaText.strval : '-',
            lemma_start: lemmaStart ? lemmaStart.strval : '?',
            lemma_end: lemmaEnd ? lemmaEnd.strval : '?',
            lemma_iri: lemmaIri ? lemmaIri : 'http://NULL'
          };
        });
      });
  }

  searchLemmata(): void {
    this.showProgbar = true;
    this.showAindex = false;
    this.lemmata = [];
    this.getLemmataService.search_lemmata_count(this.searchterm)
      .subscribe(n => (this.nLemmata = Number(n)));
    this.getLemmataService.search_lemmata(this.page, this.searchterm)
      .subscribe((data: Array<KnoraResource>) => {
        this.lemmata = data.map((x) => {
          const lemmaText = x ? x.getValue('mls:hasLemmaText') : undefined;
          const lemmaStart = x ? x.getValue('mls:hasStartDate') : undefined;
          const lemmaEnd = x ? x.getValue('mls:hasEndDate') : undefined;
          const lemmaIri = x ? x.iri : undefined;
          this.showProgbar = false;
          return {
            lemma_text: lemmaText ? lemmaText.strval : '-',
            lemma_start: lemmaStart ? lemmaStart.strval : '?',
            lemma_end: lemmaEnd ? lemmaEnd.strval : '?',
            lemma_iri: lemmaIri ? lemmaIri : 'http://NULL'
          };
        });
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
    this.getLemmata();
  }

}
